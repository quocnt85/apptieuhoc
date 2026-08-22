import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppBindings } from './bindings';

const { neonMock, postgresMock } = vi.hoisted(() => ({
  neonMock: vi.fn(),
  postgresMock: vi.fn(),
}));
vi.mock('@neondatabase/serverless', () => ({ neon: neonMock }));
vi.mock('postgres', () => ({ default: postgresMock }));

import { getSql } from './database';

const env = (overrides: Partial<AppBindings>): AppBindings => ({
  ENVIRONMENT: 'staging',
  HYPERDRIVE: { connectionString: 'postgres://hyperdrive' } as Hyperdrive,
  ...overrides,
} as AppBindings);

describe('database adapter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keeps the Neon HTTP driver only for local development', () => {
    const neonSql = vi.fn();
    neonMock.mockReturnValue(neonSql);
    expect(getSql(env({ ENVIRONMENT: 'development', HYPERDRIVE: undefined, NEON_DATABASE_URL: 'postgres://neon' }))).toBe(neonSql);
    expect(neonMock).toHaveBeenCalledWith('postgres://neon');
    expect(postgresMock).not.toHaveBeenCalled();
  });

  it('uses Postgres.js with the Hyperdrive connection string', () => {
    const client = Object.assign(vi.fn(), { begin: vi.fn() });
    postgresMock.mockReturnValue(client);
    expect(getSql(env({}))).toBe(client);
    expect(postgresMock).toHaveBeenCalledWith('postgres://hyperdrive', {
      max: 5,
      fetch_types: false,
      prepare: true,
    });
    expect(neonMock).not.toHaveBeenCalled();
  });

  it('delegates transaction-scoped query arrays to Postgres.js begin', async () => {
    const executionOrder: string[] = [];
    const lazyQuery = (name: string) => ({
      then: (resolve: (value: Array<{ name: string }>) => unknown) => {
        executionOrder.push(name);
        return Promise.resolve([{ name }]).then(resolve);
      },
    });
    const transactionClient = vi.fn((strings: TemplateStringsArray) => lazyQuery(strings[0].trim()));
    const client = Object.assign(vi.fn(), {
      begin: vi.fn(async (callback: (sql: typeof transactionClient) => readonly PromiseLike<unknown>[]) => (
        Promise.all(callback(transactionClient))
      )),
    });
    postgresMock.mockReturnValue(client);

    const sql = getSql(env({}));
    const results = await sql.transaction((tx) => [tx`first`, tx`second`]);

    expect(executionOrder).toEqual(['first', 'second']);
    expect(results).toEqual([[{ name: 'first' }], [{ name: 'second' }]]);
    expect(client.begin).toHaveBeenCalledOnce();
  });

  it('fails closed without Hyperdrive outside development', () => {
    expect(() => getSql(env({ HYPERDRIVE: undefined }))).toThrowError('Hyperdrive is required outside development.');
  });
});
