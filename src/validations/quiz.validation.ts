import { z } from 'zod';

import { paginatedSchema } from '@/validations/util.validation';

export const quizPresetSchema = {
  postCreate: z.object({
    body: z
      .object({
        answers: z.union([
          z.string().min(3),
          z.string().min(3).array().nonempty(),
        ]),
        hints: z.union([
          z.string().nullable(),
          z.string().nullable().array().nonempty(),
        ]),
        title: z.string(),
        isPrivate: z.boolean().default(false).optional(),
        hashtagList: z.string().array().nonempty(),
      })
  }),
  get: z.object({
    query: z
      .object({
        presetPin: z.union([
          z.string(),
          z
            .string()
            .array()
            .nonempty(),
        ]),
      }),
  }),
  getList: z.object({
    query: paginatedSchema,
  }),
  getBySearch: z.object({
    query: z
      .object({
        type: z.enum(['title', 'hashtag']),
        keyword: z.string(),
      })
      .merge(paginatedSchema),
  }),
  delete: z.object({
    query: z
      .object({
        presetPin: z.string(),
      })
  }),
}

export type QuizPresetSchema = {
  get: z.infer<typeof quizPresetSchema.get>;
  getList: z.infer<typeof quizPresetSchema.getList>;
  getBySearch: z.infer<typeof quizPresetSchema.getBySearch>;
  postCreate: z.infer<typeof quizPresetSchema.postCreate>;
  delete: z.infer<typeof quizPresetSchema.delete>;
}