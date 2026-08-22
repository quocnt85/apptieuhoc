import { randomBytes } from 'node:crypto';

const INTEGRATION_SCHEMA_PATTERN = /^pz_it_[0-9]{13}_[a-f0-9]{8}$/;

export const createIntegrationSchemaName = (
  timestamp = Date.now(),
  randomSuffix = randomBytes(4).toString('hex'),
) => {
  const schema = `pz_it_${timestamp}_${randomSuffix}`;
  assertIntegrationSchemaName(schema);
  return schema;
};

export const assertIntegrationSchemaName = (schema) => {
  if (!INTEGRATION_SCHEMA_PATTERN.test(schema)) {
    throw new Error('Refusing database integration operation outside an owned pz_it_* schema.');
  }
};

export const quoteIntegrationSchema = (schema) => {
  assertIntegrationSchemaName(schema);
  return `"${schema}"`;
};

export const withOwnedIntegrationSchema = async (schema, lifecycle) => {
  assertIntegrationSchemaName(schema);
  let created = false;
  let primaryError;
  let result;
  try {
    await lifecycle.create();
    created = true;
    result = await lifecycle.run();
  } catch (error) {
    primaryError = error;
  } finally {
    if (created) {
      try {
        await lifecycle.drop();
      } catch (cleanupError) {
        if (!primaryError) primaryError = cleanupError;
        else lifecycle.onCleanupError?.(cleanupError);
      }
    }
  }
  if (primaryError) throw primaryError;
  return result;
};
