import type { Context } from 'hono';
import type { AppHonoEnv } from './bindings';
import { getSql } from './database';

export type AuditResult = 'success' | 'failure' | 'denied';

export const writeAudit = async (
  c: Context<AppHonoEnv>,
  action: string,
  result: AuditResult,
  parentId?: string,
  metadata: Record<string, string | number | boolean | null> = {},
): Promise<void> => {
  const sql = getSql(c.env);
  await sql`
    INSERT INTO security_audit_log (id, parent_id, action, result, request_id, metadata)
    VALUES (${crypto.randomUUID()}, ${parentId ?? null}, ${action}, ${result}, ${c.get('requestId')}, ${JSON.stringify(metadata)}::jsonb)
  `;
};
