import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { ZodError } from 'zod';
import type { AppHonoEnv } from './bindings';
import { requireFreshPin, requireSession } from './authMiddleware';
import { confirmPinReset, refreshParentSession, registerParent, requestPinReset, setupParentPin, verifyParentEmail, verifyParentPin } from './authService';
import { constantTimeEqual, normalizeEmail } from './crypto';
import { getSql } from './database';
import { AppError, asErrorMessage } from './errors';
import { getSubscription, processRevenueCatEventWithDeadLetter, replayFailedRevenueCatEvent } from './purchaseService';
import {
  closeChildSlotSchema, confirmPinResetSchema, createChildSlotSchema, itemPurchaseSchema, registerSchema,
  refreshSessionSchema, requestPinResetSchema, revenueCatWebhookSchema, rewardApprovalSchema, setupPinSchema,
  uuidSchema, verifyEmailSchema, verifyPinSchema,
} from './validation';
import { closeChildSlot, createChildSlot, getWalletSummary, purchaseItem, transferReward } from './walletService';
import { writeAudit, type AuditResult } from './audit';
import { validateRuntimeConfiguration } from './config';
import { consumeAuthRateLimit } from './rateLimit';
import { getPurchaseReconciliationReport, getWalletReconciliationMismatches } from './reconciliationService';
import { getParentZoneObservabilitySummary } from './observabilityService';

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

const enforceAuthRateLimit = async (
  c: Context<AppHonoEnv>,
  email: string,
  action: 'otp_request' | 'otp_verify',
  sql: ReturnType<typeof getSql>,
): Promise<void> => {
  const connectingIp = c.req.header('CF-Connecting-IP')?.trim();
  const emailMax = action === 'otp_request' ? 5 : 10;
  await consumeAuthRateLimit(c.env, action, [`email:${email}`], { maxAttempts: emailMax, windowSeconds: 15 * 60 }, sql);
  if (connectingIp) {
    await consumeAuthRateLimit(c.env, action, [`ip:${connectingIp}`], { maxAttempts: emailMax * 4, windowSeconds: 15 * 60 }, sql);
  }
};

const requireAdminSecret = async (c: Context<AppHonoEnv>): Promise<void> => {
  const provided = c.req.header('X-Admin-Secret') ?? '';
  if (!provided || !(await constantTimeEqual(provided, c.env.ADMIN_UPLOAD_SECRET))) {
    throw new AppError(401, 'ADMIN_AUTH_REQUIRED', 'Không có quyền quản trị.');
  }
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
  // Only audit auth failures that already crossed the validated service boundary.
  // Malformed public requests are intentionally excluded to avoid an unauthenticated audit-log write amplifier.
  const observedAction = error instanceof AppError && c.req.path.startsWith('/api/v1/auth/') ? 'auth_error' : null;
  if (observedAction) {
    const errorCode = error instanceof AppError ? error.code : error instanceof ZodError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR';
    const result: AuditResult = error instanceof AppError && [401, 403, 429].includes(error.status) ? 'denied' : 'failure';
    auditLater(c, observedAction, result, undefined, { errorCode });
  }
  if (error instanceof AppError) {
    const retryAfter = error.details?.retryAfterSeconds;
    if (error.status === 429 && typeof retryAfter === 'number' && Number.isFinite(retryAfter)) {
      c.header('Retry-After', String(Math.max(1, Math.ceil(retryAfter))));
    }
    return c.json({ success: false, error: { code: error.code, message: error.message, details: error.details }, requestId }, error.status);
  }
  if (error instanceof ZodError) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Dữ liệu đầu vào không hợp lệ.', details: { fields: error.issues.map((issue) => issue.path.join('.')) } }, requestId }, 422);
  }
  console.error(JSON.stringify({ requestId, error: asErrorMessage(error) }));
  return c.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Đã xảy ra lỗi máy chủ.' }, requestId }, 500);
});

app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString(), environment: c.env.ENVIRONMENT }));
app.get('/ready', (c) => {
  const result = validateRuntimeConfiguration(c.env);
  if (!result.ready) return c.json({ status: 'not_ready', ...result }, 503);
  return c.json({ status: 'ready', ...result });
});

app.post('/api/v1/auth/register', async (c) => {
  const input = registerSchema.parse(await jsonBody(c));
  const email = normalizeEmail(input.email);
  const sql = getSql(c.env);
  await enforceAuthRateLimit(c, email, 'otp_request', sql);
  return c.json(await registerParent(c.env, email, input.policyVersion, input.marketingConsent, sql));
});
app.post('/api/v1/auth/verify-email', async (c) => {
  const input = verifyEmailSchema.parse(await jsonBody(c));
  const email = normalizeEmail(input.email);
  const sql = getSql(c.env);
  await enforceAuthRateLimit(c, email, 'otp_verify', sql);
  const result = await verifyParentEmail(c.env, email, input.otp, sql);
  auditLater(c, 'email_verified', 'success', result.parentId);
  return c.json(result);
});
app.post('/api/v1/auth/pin-reset/request', async (c) => {
  const input = requestPinResetSchema.parse(await jsonBody(c));
  const email = normalizeEmail(input.email);
  const sql = getSql(c.env);
  await enforceAuthRateLimit(c, email, 'otp_request', sql);
  return c.json(await requestPinReset(c.env, email, sql));
});
app.post('/api/v1/auth/pin-reset/confirm', async (c) => {
  const input = confirmPinResetSchema.parse(await jsonBody(c));
  const email = normalizeEmail(input.email);
  const sql = getSql(c.env);
  await enforceAuthRateLimit(c, email, 'otp_verify', sql);
  const result = await confirmPinReset(c.env, email, input.otp, input.newPin, sql);
  auditLater(c, 'pin_reset', 'success', result.parentId);
  return c.json(result);
});
app.post('/api/v1/auth/session/refresh', async (c) => {
  const input = refreshSessionSchema.parse(await jsonBody(c));
  const { parentId, ...tokens } = await refreshParentSession(c.env, input.refreshToken);
  auditLater(c, 'session_refresh', 'success', parentId);
  return c.json({ success: true, ...tokens });
});

app.use('/api/v1/parent/*', requireSession);
app.use('/api/v1/parent/*', async (c, next) => {
  if (c.env.PARENT_ZONE_ENABLED !== 'true') throw new AppError(503, 'FEATURE_DISABLED', 'Góc phụ huynh đang tạm tắt.');
  await next();
});
app.post('/api/v1/parent/pin/setup', async (c) => {
  const input = setupPinSchema.parse(await jsonBody(c));
  const result = await setupParentPin(c.env, c.get('parentId'), input.pin, { sessionId: c.get('sessionId') });
  auditLater(c, 'pin_setup', 'success', c.get('parentId'));
  return c.json({ success: true, ...result });
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
  const input = closeChildSlotSchema.parse(await jsonBody(c));
  const result = await closeChildSlot(c.env, c.get('parentId'), childSlotId, input.idempotencyKey);
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
  const result = await processRevenueCatEventWithDeadLetter(c.env, payload);
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
  if (!c.env.CONTENT_BUCKET) throw new AppError(503, 'CONTENT_STORAGE_UNAVAILABLE', 'Kho nội dung chưa được bật trong bản thử nghiệm.');
  const object = await c.env.CONTENT_BUCKET.get(`lessons/${packageId}.json`);
  if (!object) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Không tìm thấy gói bài học.');
  return c.json({ success: true, data: await object.json() });
});
app.get('/api/v1/admin/wallet-reconciliation', async (c) => {
  await requireAdminSecret(c);
  const parsedLimit = Number.parseInt(c.req.query('limit') ?? '100', 10);
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 500) {
    throw new AppError(422, 'INVALID_LIMIT', 'Giới hạn báo cáo phải từ 1 đến 500.');
  }
  const mismatches = await getWalletReconciliationMismatches(c.env, parsedLimit);
  auditLater(c, 'wallet_reconciliation_view', 'success', undefined, { mismatchCount: mismatches.length });
  return c.json({ success: true, mismatchCount: mismatches.length, mismatches });
});
app.get('/api/v1/admin/purchase-reconciliation', async (c) => {
  await requireAdminSecret(c);
  const hours = Number.parseInt(c.req.query('hours') ?? '24', 10);
  const limit = Number.parseInt(c.req.query('limit') ?? '500', 10);
  if (!Number.isInteger(hours) || hours < 1 || hours > 24 * 31 || !Number.isInteger(limit) || limit < 1 || limit > 1_000) {
    throw new AppError(422, 'INVALID_RECONCILIATION_WINDOW', 'Khoảng báo cáo hoặc giới hạn không hợp lệ.');
  }
  const report = await getPurchaseReconciliationReport(c.env, hours, limit);
  auditLater(c, 'purchase_reconciliation_view', 'success', undefined, { issueCount: report.issueCount, scannedEvents: report.scannedEvents });
  return c.json({ success: true, ...report });
});
app.get('/api/v1/admin/observability', async (c) => {
  await requireAdminSecret(c);
  const hours = Number.parseInt(c.req.query('hours') ?? '24', 10);
  if (!Number.isInteger(hours) || hours < 1 || hours > 24 * 31) {
    throw new AppError(422, 'INVALID_OBSERVABILITY_WINDOW', 'Khoảng thống kê phải từ 1 đến 744 giờ.');
  }
  const summary = await getParentZoneObservabilitySummary(c.env, hours);
  auditLater(c, 'observability_view', 'success', undefined, { hours: summary.hours, status: summary.status });
  return c.json({ success: true, ...summary });
});
app.post('/api/v1/admin/purchase-events/:eventId/replay', async (c) => {
  await requireAdminSecret(c);
  const result = await replayFailedRevenueCatEvent(c.env, c.req.param('eventId'));
  auditLater(c, 'purchase_event_replay', 'success', undefined, { eventId: c.req.param('eventId'), duplicate: result.duplicate });
  return c.json({ success: true, result });
});
app.post('/api/v1/admin/content/upload', async (c) => {
  await requireAdminSecret(c);
  if (!c.env.CONTENT_BUCKET) throw new AppError(503, 'CONTENT_STORAGE_UNAVAILABLE', 'Kho nội dung chưa được bật trong bản thử nghiệm.');
  const body = await jsonBody(c) as { packageId?: unknown; content?: unknown };
  if (typeof body.packageId !== 'string' || !/^[a-zA-Z0-9._-]{1,128}$/.test(body.packageId) || body.content === undefined) throw new AppError(422, 'INVALID_CONTENT_PACKAGE', 'Gói nội dung không hợp lệ.');
  const key = `lessons/${body.packageId}.json`;
  await c.env.CONTENT_BUCKET.put(key, JSON.stringify(body.content), { httpMetadata: { contentType: 'application/json' } });
  return c.json({ success: true, key });
});

export default app;
