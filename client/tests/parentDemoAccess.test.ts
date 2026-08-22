import { describe, expect, it } from 'vitest';
import {
  isParentDemoPassword,
  isParentDemoPasswordLength,
} from '../src/config/parentDemoAccess';

describe('Parent Zone demo access policy', () => {
  it('accepts both temporary review passwords and rejects other values', () => {
    expect(isParentDemoPassword('1234')).toBe(true);
    expect(isParentDemoPassword('123456')).toBe(true);
    expect(isParentDemoPassword('1111')).toBe(false);
    expect(isParentDemoPassword('12345')).toBe(false);
  });

  it('only enables the submit action for a supported password length', () => {
    expect(isParentDemoPasswordLength('0000')).toBe(true);
    expect(isParentDemoPasswordLength('000000')).toBe(true);
    expect(isParentDemoPasswordLength('00000')).toBe(false);
  });

});
