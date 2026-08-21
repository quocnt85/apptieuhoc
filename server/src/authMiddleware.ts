import type { MiddlewareHandler } from 'hono';
import type { AppHonoEnv } from './bindings';
import { sha256Hex } from './crypto';
import { getSql } from './database';
import { AppError } from './errors';

type SessionRow = {
  session_id: string;
  parent_id: string;
  last_reauthenticated_at: string | null;
};

export const requireSession: MiddlewareHandler<AppHonoEnv> = async (c, next) => {
  const authorization = c.req.header('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Cần đăng nhập tài khoản phụ huynh.');
  }
  const token = authorization.slice(7).trim();
  if (!/^[0-9a-f]{64}$/i.test(token)) throw new AppError(401, 'INVALID_SESSION', 'Phiên đăng nhập không hợp lệ.');

  const tokenHash = await sha256Hex(`${token}:${c.env.SESSION_PEPPER}`);
  const sql = getSql(c.env);
  const rows = await sql`
    SELECT session.id AS session_id, session.parent_id, session.last_reauthenticated_at
    FROM parent_sessions session
    JOIN parent_accounts parent ON parent.id = session.parent_id
    WHERE session.token_hash = ${tokenHash}
      AND session.revoked_at IS NULL
      AND session.expires_at > NOW()
      AND parent.status = 'active'
    LIMIT 1
  ` as SessionRow[];
  const session = rows[0];
  if (!session) throw new AppError(401, 'INVALID_SESSION', 'Phiên đăng nhập đã hết hạn hoặc bị thu hồi.');

  c.set('parentId', session.parent_id);
  c.set('sessionId', session.session_id);
  c.set('lastReauthenticatedAt', session.last_reauthenticated_at);
  await next();
};

export const requireFreshPin: MiddlewareHandler<AppHonoEnv> = async (c, next) => {
  const value = c.get('lastReauthenticatedAt');
  const isFresh = value && Date.now() - new Date(value).getTime() <= 5 * 60_000;
  if (!isFresh) throw new AppError(403, 'PIN_REAUTH_REQUIRED', 'Vui lòng nhập lại mã PIN phụ huynh.');
  await next();
};
