import { describe, expect, it } from 'vitest';

import { MODERATION_STATUSES } from '@/types/moderation';

describe('job moderation contract', () => {
  it('defines every moderation queue state', () => {
    expect(MODERATION_STATUSES).toEqual([
      'Pending',
      'Approved',
      'Rejected',
      'Flagged',
      'Suspended',
      'Archived',
      'Deleted',
    ]);
  });
});
