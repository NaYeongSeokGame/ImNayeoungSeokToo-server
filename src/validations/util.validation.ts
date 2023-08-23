import { z } from 'zod';

export const paginatedSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).default(9).optional(),
});
