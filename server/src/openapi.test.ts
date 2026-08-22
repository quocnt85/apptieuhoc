import { describe, expect, it } from 'vitest';
import specDocument from '../openapi/parent-zone.v1.json';
import appSource from './app.ts?raw';

type Operation = {
  operationId?: string;
  security?: Array<Record<string, unknown>>;
  'x-requires-fresh-pin'?: boolean;
};

type OpenApiDocument = {
  openapi: string;
  paths: Record<string, Record<string, Operation | unknown>>;
  components: {
    schemas: Record<string, Record<string, unknown>>;
    securitySchemes: Record<string, unknown>;
  };
};

const spec = specDocument as OpenApiDocument;
const methods = new Set(['get', 'post', 'put', 'patch', 'delete']);

const contractOperations = () => Object.entries(spec.paths).flatMap(([path, pathItem]) =>
  Object.entries(pathItem)
    .filter(([method]) => methods.has(method))
    .map(([method, operation]) => ({ method, path, operation: operation as Operation })),
);

const implementedOperations = () => [...appSource.matchAll(/app\.(get|post|put|patch|delete)\('([^']+)'/g)]
  .map((match) => ({ method: match[1], path: match[2].replace(/:([A-Za-z0-9_]+)/g, '{$1}') }))
  .filter(({ path }) => path.startsWith('/api/v1/auth/') || path.startsWith('/api/v1/parent/') || path === '/api/v1/webhooks/revenuecat');

describe('Parent Zone OpenAPI contract', () => {
  it('is OpenAPI 3.1 and covers every implemented Parent Zone route exactly once', () => {
    expect(spec.openapi).toBe('3.1.0');
    const expected = implementedOperations().map(({ method, path }) => `${method.toUpperCase()} ${path}`).sort();
    const documented = contractOperations().map(({ method, path }) => `${method.toUpperCase()} ${path}`).sort();
    expect(documented).toEqual(expected);
  });

  it('uses unique operation IDs and session security on every parent route', () => {
    const operations = contractOperations();
    const operationIds = operations.map(({ operation }) => operation.operationId);
    expect(operationIds.every(Boolean)).toBe(true);
    expect(new Set(operationIds).size).toBe(operationIds.length);

    for (const { path, operation } of operations.filter(({ path }) => path.startsWith('/api/v1/parent/'))) {
      expect(operation.security).toContainEqual({ parentSession: [] });
    }
  });

  it('marks every server fresh-PIN route in the public contract', () => {
    const freshPinOperations = contractOperations()
      .filter(({ operation }) => operation['x-requires-fresh-pin'])
      .map(({ method, path }) => `${method.toUpperCase()} ${path}`)
      .sort();
    expect(freshPinOperations).toEqual([
      'DELETE /api/v1/parent/account',
      'DELETE /api/v1/parent/child-slots/{childSlotId}',
      'POST /api/v1/parent/child-slots',
      'POST /api/v1/parent/rewards/approve',
    ]);
  });

  it('mirrors the primitive Zod validation constraints', () => {
    expect(spec.components.schemas.Pin.pattern).toBe('^[0-9]{6}$');
    expect(spec.components.schemas.Otp.pattern).toBe('^[0-9]{6}$');
    expect(spec.components.schemas.SessionToken.pattern).toBe('^[0-9a-fA-F]{64}$');
    expect(spec.components.schemas.IdempotencyKey).toMatchObject({ minLength: 8, maxLength: 128, pattern: '^[A-Za-z0-9._:-]+$' });
  });

  it('does not define child identity, learning, usage or media properties', () => {
    const serialized = JSON.stringify(spec.components.schemas);
    for (const forbiddenProperty of ['childName', 'gradeLevel', 'learningProgress', 'answerText', 'usageMinutes', 'photoUrl', 'avatarUrl']) {
      expect(serialized).not.toContain(`\"${forbiddenProperty}\"`);
    }
  });
});
