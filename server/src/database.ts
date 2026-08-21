import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { AppBindings } from './bindings';
import { AppError } from './errors';

export type Sql = NeonQueryFunction<false, false>;

export const getSql = (env: AppBindings): Sql => {
  const connectionString = env.HYPERDRIVE?.connectionString || env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new AppError(503, 'DATABASE_NOT_CONFIGURED', 'Database is not configured.');
  }
  return neon(connectionString);
};
