import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { ZodError } from 'zod';
import type { AppHonoEnv } from './bindings';
import { requireFreshPin, requireSession } from './authMiddleware';
import { confirmPinReset, registerParent, requestPinReset, setupParentPin, verifyParentEmail, verifyParentPin } from './authService';
import { constantTimeEqual, normalizeEmail } from './crypto';
import { getSql } from './database';
import { AppError, asErrorMessage } from './errors';
import { getSubscription, processRevenueCatEvent } from './purchaseService';
import {
  confirmPinResetSchema, createChildSlotSchema, itemPurchaseSchema, registerSchema,
  requestPinResetSchema, revenueCatWebhookSchema, rewardApprovalSchema, setupPinSchema,
  uuidSchema, verifyEmailSchema, verifyPinSchema,
} from './validation';
import { closeChildSlot, createChildSlot, getWalletSummary, purchaseItem, transferReward } from './walletService';
import { writeAudit, type AuditResult } from './audit';

const app = new Hono<AppHonoEnv>();
const MAX_JSON_BYTES = 1_000_000;

const auditLater = (
  c: Context<AppHonoEnv>,
  action: string,
  result: AuditResult,
  parentId?: string,
  metadata: Record<string, string | number | boolean | null> = {},
) => {
  const task = writeAudit(c, action, result, parentId, metadata).catch((error) => {
    console.error(JSON.stringify({ requestId: c.get('requestId'), auditAction: action, error: asErrorMessage(error) }));
  });
  try { c.executionCtx.waitUntil(task); } catch { void task; }
};

const jsonBody = async (c: Context<AppHonoEnv>): Promise<unknown> => {
  const contentLength = Number(c.req.header('Content-Length') ?? 0);
  if (contentLength > MAX_JSON_BYTES) throw new AppError(422, 'PAYLOAD_TOO_LARGE', 'Dữ liệu gửi lên quá lớn.');
  try { return await c.req.json(); } catch { throw new AppError(422, 'INVALID_JSON', 'Nội dung JSON không hợp lệ.'); }
};

app.use('*', async (c, next) => {
  const incoming = c.req.header('X-Request-ID');
  c.set('requestId', incoming && /^[A-Za-z0-9._:-]{8,64}$/.test(incoming) ? incoming : crypto.randomUUID());
  await next();
  c.header('X-Request-ID', c.get('requestId'));
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'no-referrer');
  c.header('Cache-Control', 'no-store');
});

app.use('*', cors({
  origin: (origin, c) => {
    if (!origin) return '';
    const allowed = new Set(c.env.ALLOWED_ORIGINS.split(',').map((value: string) => value.trim()));
    return allowed.has(origin) ? origin : '';
  },
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Admin-Secret', 'X-Request-ID'],
  maxAge: 86400,
}));

app.onError((error, c) => {
  const requestId = c.get('requestId') || crypto.randomUUID();
  if (error instanceof AppError) {
    return c.json({ success: false, error: { code: error.code, message: error.message, details: error.details }, requestId }, error.status);
  }
  if (error instanceof ZodError) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Dữ liệu đầu vào không hợp lệ.', details: { fields: error.issues.map((issue) => issue.path.join('.')) } }, requestId }, 422);
  }
  console.error(JSON.stringify({ requestId, error: asErrorMessage(error) }));
  return c.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Đã xảy ra lỗi máy chủ.' }, requestId }, 500);
});

app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString(), environment: c.env.ENVIRONMENT }));

app.post('/api/v1/auth/register', async (c) => {
  const input = registerSchema.parse(await jsonBody(c));
  return c.json(await registerParent(c.env, normalizeEmail(input.email), input.policyVersion, input.marketingConsent));
});
app.post('/api/v1/auth/verify-email', async (c) => {
  const input = verifyEmailSchema.parse(await jsonBody(c));
  const result = await verifyParentEmail(c.env, normalizeEmail(input.email), input.otp);
  auditLater(c, 'email_verified', 'success', result.parentId);
  return c.json(result);
});
app.post('/api/v1/auth/pin-reset/request', async (c) => {
  const input = requestPinResetSchema.parse(await jsonBody(c));
  return c.json(await requestPinReset(c.env, normalizeEmail(input.email)));
});
app.post('/api/v1/auth/pin-reset/confirm', async (c) => {
  const input = confirmPinResetSchema.parse(await jsonBody(c));
  const result = await confirmPinReset(c.env, normalizeEmail(input.email), input.otp, input.newPin);
  auditLater(c, 'pin_reset', 'success', result.parentId);
  return c.json(result);
});

app.use('/api/v1/parent/*', requireSession);
app.use('/api/v1/parent/*', async (c, next) => {
  if (c.env.PARENT_ZONE_ENABLED !== 'true') throw new AppError(503, 'FEATURE_DISABLED', 'Góc phụ huynh đang tạm tắt.');
  await next();
});
app.post('/api/v1/parent/pin/setup', async (c) => {
  const input = setupPinSchema.parse(await jsonBody(c));
  await setupParentPin(c.env, c.get('parentId'), input.pin);
  auditLater(c, 'pin_setup', 'success', c.get('parentId'));
  return c.json({ success: true });
});
app.post('/api/v1/parent/pin/verify', async (c) => {
  const input = verifyPinSchema.parse(await jsonBody(c));
  try {
    const result = await verifyParentPin(c.env, c.get('parentId'), c.get('sessionId'), input.pin);
    auditLater(c, 'pin_verify', 'success', c.get('parentId'));
    return c.json(result);
  } catch (error) {
    auditLater(c, 'pin_verify', 'denied', c.get('parentId'));
    throw error;
  }
});
app.post('/api/v1/parent/logout', async (c) => {
  await getSql(c.env)`UPDATE parent_sessions SET revoked_at = NOW() WHERE id = ${c.get('sessionId')}`;
  auditLater(c, 'logout', 'success', c.get('parentId'));
  return c.json({ success: true });
});
app.delete('/api/v1/parent/account', requireFreshPin, async (c) => {
  const sql = getSql(c.env);
  const parentId = c.get('parentId');
  await sql.transaction((tx) => [
    tx`UPDATE parent_accounts SET status = 'closed', email_normalized = ${`deleted+${crypto.randomUUID()}@invalid.local`}, updated_at = NOW() WHERE id = ${parentId}`,
    tx`UPDATE parent_sessions SET revoked_at = NOW() WHERE parent_id = ${parentId} AND revoked_at IS NULL`,
    tx`UPDATE child_wallet_slots SET status = 'closed', closed_at = NOW() WHERE parent_id = ${parentId} AND status = 'active'`,
  ]);
  auditLater(c, 'account_delete', 'success', parentId);
  return c.json({ success: true });
});
app.get('/api/v1/parent/wallets', async (c) => c.json({ success: true, ...(await getWalletSummary(c.env, c.get('parentId'))) }));
app.get('/api/v1/parent/subscriptions', async (c) => c.json({ success: true, subscriptions: await getSubscription(c.env, c.get('parentId')) }));
app.post('/api/v1/parent/child-slots', requireFreshPin, async (c) => {
  const input = createChildSlotSchema.parse(await jsonBody(c));
  const result = await createChildSlot(c.env, c.get('parentId'), input.idempotencyKey);
  auditLater(c, 'child_slot_create', 'success', c.get('parentId'), { childSlotId: result.childSlotId });
  return c.json({ success: true, ...result }, 201);
});
app.delete('/api/v1/parent/child-slots/:childSlotId', requireFreshPin, async (c) => {
  const childSlotId = uuidSchema.parse(c.req.param('childSlotId'));
  const result = await closeChildSlot(c.env, c.get('parentId'), childSlotId);
  auditLater(c, 'child_slot_close', 'success', c.get('parentId'), { childSlotId, returnedDiamonds: result.returnedDiamonds });
  return c.json({ success: true, ...result });
});
app.post('/api/v1/parent/rewards/approve', requireFreshPin, async (c) => {
  if (c.env.REAL_LIFE_REWARDS_ENABLED !== 'true') throw new AppError(503, 'FEATURE_DISABLED', 'Duyệt phần thưởng đang tạm tắt.');
  const input = rewardApprovalSchema.parse(await jsonBody(c));
  const result = await transferReward(c.env, c.get('parentId'), input.childSlotId, input.rewardRequestId, input.diamonds);
  auditLater(c, 'reward_approve', 'success', c.get('parentId'), { childSlotId: input.childSlotId, diamonds: input.diamonds, duplicate: result.alreadyProcessed });
  return c.json({ success: true, ...result });
});
app.post('/api/v1/parent/items/purchase', async (c) => {
  const input = itemPurchaseSchema.parse(await jsonBody(c));
  const result = await purchaseItem(c.env, c.get('parentId'), input.childSlotId, input.purchaseRequestId, input.sku);
  auditLater(c, 'item_purchase', 'success', c.get('parentId'), { childSlotId: input.childSlotId, sku: input.sku, duplicate: result.alreadyProcessed });
  return c.json({ success: true, ...result });
});

app.post('/api/v1/webhooks/revenuecat', async (c) => {
  const provided = c.req.header('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!provided || !(await constantTimeEqual(provided, c.env.REVENUECAT_WEBHOOK_SECRET))) {
    throw new AppError(401, 'INVALID_WEBHOOK_SIGNATURE', 'Webhook authorization failed.');
  }
  const payload = revenueCatWebhookSchema.parse(await jsonBody(c));
  const result = await processRevenueCatEvent(c.env, payload);
  auditLater(c, `revenuecat_${result.kind}`, 'success', payload.event.app_user_id, { eventType: payload.event.type, duplicate: result.duplicate });
  return c.json(result);
});

app.get('/api/v1/questions', async (c) => {
  const domainId = c.req.query('domainId');
  const grade = c.req.query('grade');
  const parsedGrade = grade ? Number.parseInt(grade, 10) : null;
  if (grade && (!Number.isInteger(parsedGrade) || parsedGrade! < 1 || parsedGrade! > 5)) throw new AppError(422, 'INVALID_GRADE', 'Khối lớp không hợp lệ.');
  const sql = getSql(c.env);
  const rows = domainId && parsedGrade
    ? await sql`SELECT * FROM questions WHERE domain_id = ${domainId} AND grade_level = ${parsedGrade} ORDER BY id ASC LIMIT 50`
    : domainId
      ? await sql`SELECT * FROM questions WHERE domain_id = ${domainId} ORDER BY id ASC LIMIT 50`
      : await sql`SELECT * FROM questions ORDER BY grade_level ASC, id ASC LIMIT 50`;
  return c.json({ success: true, count: rows.length, data: rows });
});

app.get('/api/v1/content/:packageId', async (c) => {
  const packageId = c.req.param('packageId');
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(packageId)) throw new AppError(422, 'INVALID_PACKAGE_ID', 'Package ID không hợp lệ.');
  const object = await c.env.CONTENT_BUCKET.get(`lessons/${packageId}.json`);
  if (!object) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Không tìm thấy gói bài học.');
  return c.json({ success: true, data: await object.json() });
});
app.post('/api/v1/content/upload', async (c) => {
  const provided = c.req.header('X-Admin-Secret') ?? '';
  if (!provided || !(await constantTimeEqual(provided, c.env.ADMIN_UPLOAD_SECRET))) throw new AppError(401, 'ADMIN_AUTH_REQUIRED', 'Không có quyền tải nội dung lên.');
  const body = await jsonBody(c) as { packageId?: unknown; content?: unknown };
  if (typeof body.packageId !== 'string' || !/^[a-zA-Z0-9._-]{1,128}$/.test(body.packageId) || body.content === undefined) throw new AppError(422, 'INVALID_CONTENT_PACKAGE', 'Gói nội dung không hợp lệ.');
  const key = `lessons/${body.packageId}.json`;
  await c.env.CONTENT_BUCKET.put(key, JSON.stringify(body.content), { httpMetadata: { contentType: 'application/json' } });
  return c.json({ success: true, key });
});

export default app;
