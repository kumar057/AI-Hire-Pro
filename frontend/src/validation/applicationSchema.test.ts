import { describe, expect, it } from 'vitest';

import { APPLICATION_STATUSES } from '@/types/applications';
import { applicationSchema } from '@/validation/applicationSchema';

describe('application form contract', () => {
  it('accepts a selected resume and optional cover letter', () => {
    expect(
      applicationSchema.safeParse({ resume_id: 'resume-current', cover_letter: '' }).success,
    ).toBe(true);
  });

  it('requires a resume and limits cover letter length', () => {
    const result = applicationSchema.safeParse({ resume_id: '', cover_letter: 'x'.repeat(5001) });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(
      expect.arrayContaining(['resume_id', 'cover_letter']),
    );
  });

  it('defines every supported application lifecycle status', () => {
    expect(APPLICATION_STATUSES).toHaveLength(11);
    expect(APPLICATION_STATUSES).toContain('Offer Accepted');
    expect(APPLICATION_STATUSES).toContain('Withdrawn');
  });
});
