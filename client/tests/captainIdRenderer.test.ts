import { describe, expect, it } from 'vitest';
import { buildCaptainIdFilename, sanitizeCaptainIdFields } from '../src/services/personalization/captainIdRenderer';

describe('Captain ID export whitelist', () => {
  it('keeps only bounded display fields', () => {
    const output = sanitizeCaptainIdFields({ nickname: '  Nova '.repeat(10), grade: 9, title: 'A'.repeat(100), totalStars: -4, completedCoordinates: 3.7, presetAvatar: '🧑‍🚀', avatarAsset: null, approvedFlagAsset: null });
    expect(output.nickname.length).toBeLessThanOrEqual(24);
    expect(output.title.length).toBeLessThanOrEqual(40);
    expect(output.grade).toBe(5);
    expect(output.totalStars).toBe(0);
    expect(output.completedCoordinates).toBe(4);
    expect(Object.keys(output)).not.toContain('childId');
  });

  it('uses a generic filename with no local identifier', () => {
    expect(buildCaptainIdFilename(new Date('2026-08-22T00:00:00Z'))).toBe('novastars-space-id-2026-08-22.png');
  });
});
