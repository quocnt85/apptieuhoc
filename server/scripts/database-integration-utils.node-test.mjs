import assert from 'node:assert/strict';
import test from 'node:test';
import { assertIntegrationSchemaName, createIntegrationSchemaName, quoteIntegrationSchema, withOwnedIntegrationSchema } from './database-integration-utils.mjs';

test('creates and quotes only an owned database integration schema', () => {
  const schema = createIntegrationSchemaName(1724300000000, 'a1b2c3d4');
  assert.equal(schema, 'pz_it_1724300000000_a1b2c3d4');
  assert.equal(quoteIntegrationSchema(schema), '"pz_it_1724300000000_a1b2c3d4"');
});

test('never drops a schema that this run failed to create', async () => {
  let dropped = false;
  await assert.rejects(() => withOwnedIntegrationSchema('pz_it_1724300000000_a1b2c3d4', {
    create: async () => { throw new Error('schema already exists'); },
    run: async () => undefined,
    drop: async () => { dropped = true; },
  }), /schema already exists/);
  assert.equal(dropped, false);
});

test('always drops an owned schema after a successful create, including when the test fails', async () => {
  const calls = [];
  await assert.rejects(() => withOwnedIntegrationSchema('pz_it_1724300000000_a1b2c3d4', {
    create: async () => { calls.push('create'); },
    run: async () => { calls.push('run'); throw new Error('test failed'); },
    drop: async () => { calls.push('drop'); },
  }), /test failed/);
  assert.deepEqual(calls, ['create', 'run', 'drop']);
});

test('refuses broad, shared or injected schema targets', () => {
  for (const schema of ['public', 'pz_it_manual', 'pz_it_1724300000000_a1b2c3d4;DROP SCHEMA public', '']) {
    assert.throws(() => assertIntegrationSchemaName(schema), /Refusing database integration operation/);
  }
});
