import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import postgres from 'postgres';
import type { AppBindings } from './bindings';
import { AppError } from './errors';

export type Sql = NeonQueryFunction<false, false>;

type PostgresClient = ReturnType<typeof postgres>;
type CompatTransactionFactory = (sql: Sql) => readonly PromiseLike<unknown>[];

const transactionTag = (client: unknown): Sql => client as Sql;

export const adaptPostgresClient = (client: PostgresClient): Sql => {
  const tagged = client as unknown as Sql;
  Object.defineProperty(tagged, 'transaction', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: (factory: CompatTransactionFactory) => {
      if (typeof factory !== 'function') {
        throw new TypeError('Postgres.js transactions require a transaction-scoped query factory.');
      }
      return client.begin((transactionClient) => factory(transactionTag(transactionClient)));
    },
  });
  return tagged;
};

export const getSql = (env: AppBindings): Sql => {
  if ((env.ENVIRONMENT === 'staging' || env.ENVIRONMENT === 'production') && !env.HYPERDRIVE?.connectionString) {
    throw new AppError(503, 'HYPERDRIVE_REQUIRED', 'Hyperdrive is required outside development.');
  }
  if (env.HYPERDRIVE?.connectionString) {
    return adaptPostgresClient(postgres(env.HYPERDRIVE.connectionString, {
      max: 5,
      fetch_types: false,
      prepare: true,
    }));
  }
  const connectionString = env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new AppError(503, 'DATABASE_NOT_CONFIGURED', 'Database is not configured.');
  }
  return neon(connectionString);
};
