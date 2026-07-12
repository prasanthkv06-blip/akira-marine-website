import { describe, it, expect } from 'vitest';
import { buildObjectPath } from './uploads';

describe('buildObjectPath', () => {
  it('nests under the invite folder with the field and a safe extension', () => {
    const p = buildObjectPath('abc', 'photo', 'My Pic.JPG');
    expect(p).toMatch(/^onboarding\/abc\/photo-[A-Za-z0-9_-]+\.jpg$/);
  });
  it('defaults unknown extensions to bin', () => {
    expect(buildObjectPath('abc', 'passportBack', 'file')).toMatch(/passportBack-.+\.bin$/);
  });
});
