import { z } from 'zod';

export const applicationSchema = z.object({
  resume_id: z.string().min(1, 'Choose a resume'),
  cover_letter: z.string().max(5000, 'Cover letter must be under 5,000 characters'),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
