import { z } from 'zod';

export const paginatedSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().default(9),
});
