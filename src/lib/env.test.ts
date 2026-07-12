import { describe, it, expect } from 'vitest';
import { requireEnv } from './env';

describe('requireEnv', () => {
  it('returns the value when set', () => {
    process.env.TEST_X = 'hello';
    expect(requireEnv('TEST_X')).toBe('hello');
  });
  it('throws a clear error when missing', () => {
    delete process.env.TEST_MISSING;
    expect(() => requireEnv('TEST_MISSING')).toThrow('TEST_MISSING is not set');
  });
});
