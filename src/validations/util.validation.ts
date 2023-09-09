import { z } from 'zod';

export const paginatedSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().default(9),
});

export const hashtagSchema = z.string().min(3).max(10);

export const presetPinSchema = z.string().regex(/[A-Z0-9]{6}/);