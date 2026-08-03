import { describe, expect, it } from 'vitest';

import { PIPELINE_STAGES } from '@/types/recruiter';

describe('recruiter pipeline contract', () => {
  it('defines the complete ordered hiring pipeline', () => {
    expect(PIPELINE_STAGES).toEqual([
      'Applied',
      'Screening',
      'Shortlisted',
      'Technical Interview',
      'HR Interview',
      'Final Review',
      'Offer',
      'Hired',
      'Rejected',
    ]);
  });
});
