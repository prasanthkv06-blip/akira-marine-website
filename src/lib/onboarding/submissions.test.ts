import { describe, it, expect } from 'vitest';
import { pathBelongsToInvite } from './submissions';

describe('pathBelongsToInvite', () => {
  it('accepts a path under the invite folder', () => {
    expect(pathBelongsToInvite('onboarding/abc/photo-1.jpg', 'abc')).toBe(true);
  });
  it('rejects a path for a different invite', () => {
    expect(pathBelongsToInvite('onboarding/xyz/photo-1.jpg', 'abc')).toBe(false);
  });
  it('rejects traversal attempts', () => {
    expect(pathBelongsToInvite('onboarding/abc/../xyz/p.jpg', 'abc')).toBe(false);
  });
});
