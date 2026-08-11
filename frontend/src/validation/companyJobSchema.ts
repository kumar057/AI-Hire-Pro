import { z } from 'zod';

export const companyJobSchema = z.object({
  title: z.string().min(3, 'Job title must contain at least 3 characters'),
  company: z.string().min(2, 'Company name is required'),
  department: z.string().min(2, 'Department is required'),
  description: z.string().min(40, 'Description must contain at least 40 characters'),
  responsibilities: z.string().min(10, 'Add at least one responsibility'),
  skills: z.string().min(2, 'Add at least one required skill'),
  preferred_skills: z.string(),
  experience_level: z.string().min(1, 'Experience is required'),
  salary_range: z.string().min(3, 'Salary range is required'),
  employment_type: z.string().min(1, 'Employment type is required'),
  work_mode: z.string().min(1, 'Work mode is required'),
  location: z.string().min(2, 'Location is required'),
  openings: z.number().int().min(1).max(100),
  category: z.string().min(2, 'Category is required'),
  tags: z.string(),
  application_deadline: z.string().min(1, 'Deadline is required'),
  benefits: z.string(),
  education: z.string().min(2, 'Education requirement is required'),
  requirements: z.string().min(10, 'Add at least one requirement'),
});

export type CompanyJobFormValues = z.infer<typeof companyJobSchema>;

