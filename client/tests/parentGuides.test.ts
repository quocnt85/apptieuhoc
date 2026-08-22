import { describe, expect, it } from 'vitest';
import { conversationTemplatesForContent, PARENT_GUIDES, validateParentGuideCatalog, visibleParentGuides } from '../src/content/parentGuides';
import { isApprovedParentExternalUrl } from '../src/services/parentExternalLinks';

describe('offline Parent Guide catalog', () => {
  it('has unique, complete content and review metadata', () => {
    expect(validateParentGuideCatalog()).toEqual([]);
    expect(new Set(PARENT_GUIDES.map((guide) => guide.id)).size).toBe(PARENT_GUIDES.length);
    expect(PARENT_GUIDES.every((guide) => guide.review.author && guide.review.reviewer && guide.review.version && guide.review.reviewedAt)).toBe(true);
  });

  it('keeps massage guidance in the draft catalog but hides it without the review flag', () => {
    const draft = PARENT_GUIDES.find((guide) => guide.id === 'gentle-eye-massage-draft');
    expect(draft?.review.status).toBe('PENDING_HEALTH_REVIEW');
    expect(draft?.checklist.join(' ')).toContain('không ấn vào nhãn cầu');
    expect(visibleParentGuides(false).some((guide) => guide.id === draft?.id)).toBe(false);
    expect(visibleParentGuides(true).some((guide) => guide.id === draft?.id)).toBe(true);
  });

  it('maps lesson/content IDs only to approved conversation templates', () => {
    expect(conversationTemplatesForContent('Q-FIN-001')[0]?.prompts.length).toBeGreaterThanOrEqual(2);
    expect(conversationTemplatesForContent('eye-break-draft')).toEqual([]);
    expect(conversationTemplatesForContent('unknown')).toEqual([]);
  });

  it('ships only reviewed external sources without child data in the URL', () => {
    const sources = PARENT_GUIDES.flatMap((guide) => guide.externalSources ?? []);
    expect(sources.length).toBeGreaterThan(0);
    expect(sources.every((source) => isApprovedParentExternalUrl(source.url))).toBe(true);
    expect(sources.every((source) => !new URL(source.url).search && !new URL(source.url).hash)).toBe(true);
  });
});
