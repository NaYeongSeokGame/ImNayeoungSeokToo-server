import { z } from 'zod';

import {
  hashtagSchema,
  paginatedSchema,
  presetPinSchema,
} from '@/validations/util.validation';

export const quizPresetSchema = {
  postCreate: z.object({
    body: z.object({
      answers: z.union([
        z.string().min(3),
        z.string().min(3).array().nonempty(),
      ]),
      hints: z.union([
        z.string().nullable(),
        z.string().nullable().array().nonempty(),
      ]),
      title: z.string(),
      isPrivate: z.coerce.boolean().default(false).optional(),
      hashtagList: hashtagSchema.array().optional(),
    }),
  }),
  get: z.object({
    query: z.object({
      presetPin: z.union([presetPinSchema, presetPinSchema.array().nonempty()]),
    }),
  }),
  getList: z.object({
    query: paginatedSchema,
  }),
  getAnswer: z.object({
    query: z.object({
      presetPin: presetPinSchema,
    }),
  }),
  getBySearch: z.object({
    query: z
      .object({
        type: z.enum(['title', 'hashtag']),
        keyword: presetPinSchema,
      })
      .merge(paginatedSchema),
  }),
  delete: z.object({
    query: z.object({
      presetPin: presetPinSchema,
    }),
  }),
  patchModify: z.object({
    body: z.object({
      addQuizAnswers: z.union([
        z.string().min(3),
        z.string().min(3).array().nonempty(),
      ]).optional(),
      addQuizHints: z.union([
        z.string().nullable(),
        z.string().nullable().array().nonempty(),
      ]).optional(),
      removedQuizIndexList: z.string().array().optional(),
      addHashtagList: hashtagSchema.array().optional(),
      removedHashtagList: hashtagSchema.array().optional(),
      title: z.string().optional(),
      isPrivate: z.coerce.boolean().optional(),
      presetPin: presetPinSchema,
    }),
  }),
};

export type QuizPresetSchema = {
  get: z.infer<typeof quizPresetSchema.get>;
  getAnswer: z.infer<typeof quizPresetSchema.getAnswer>;
  getList: z.infer<typeof quizPresetSchema.getList>;
  getBySearch: z.infer<typeof quizPresetSchema.getBySearch>;
  postCreate: z.infer<typeof quizPresetSchema.postCreate>;
  delete: z.infer<typeof quizPresetSchema.delete>;
  patchModify: z.infer<typeof quizPresetSchema.patchModify>;
};
