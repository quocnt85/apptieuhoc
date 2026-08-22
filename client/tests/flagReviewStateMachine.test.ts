import { describe, expect, it } from 'vitest';
import { canTransitionFlagReview } from '../src/stores/usePersonalizationStore';

describe('flag review state machine', () => {
  it('allows only child submit and parent decisions in sequence', () => {
    expect(canTransitionFlagReview('DRAFT_LOCAL', 'PENDING_PARENT_REVIEW')).toBe(true);
    expect(canTransitionFlagReview('PENDING_PARENT_REVIEW', 'APPROVED_LOCAL')).toBe(true);
    expect(canTransitionFlagReview('PENDING_PARENT_REVIEW', 'REJECTED')).toBe(true);
    expect(canTransitionFlagReview('APPROVED_LOCAL', 'DRAFT_LOCAL')).toBe(true);
  });

  it('does not allow a draft to bypass parent review', () => {
    expect(canTransitionFlagReview('DRAFT_LOCAL', 'APPROVED_LOCAL')).toBe(false);
    expect(canTransitionFlagReview('REJECTED', 'APPROVED_LOCAL')).toBe(false);
    expect(canTransitionFlagReview('APPROVED_LOCAL', 'PENDING_PARENT_REVIEW')).toBe(false);
  });
});
