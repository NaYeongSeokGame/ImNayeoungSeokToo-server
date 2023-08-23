import { z } from 'zod';

import { paginatedSchema } from '@/validations/util.validation';

export const getQuizPresetListSchema = z.object({
  params: paginatedSchema,
});

export const postCreateQuizPresetSchema = z.object({
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
});

export const getQuizPresetSchema = z.object({
  query: z
    .object({
      presetPin: z.union([
        z.string().regex(/[0-9A-Z]{6}/),
        z
          .string()
          .regex(/[0-9A-Z]{6}/)
          .array()
          .nonempty(),
      ]),
    })
});

export const getQuizPresetBySearchSchema = z.object({
  query: z
    .object({
      type: z.enum(['title', 'hashtag']),
      keyword: z.string(),
    })
    .merge(paginatedSchema),
});

export const deleteQuizPresetSchema = z.object({
    query: z
      .object({
        presetPin: z.string(),
      })
  });

export type GetQuizPresetList = z.infer<typeof getQuizPresetListSchema>;
export type PostCreateQuizPreset = z.infer<typeof postCreateQuizPresetSchema>;
export type GetQuizPreset = z.infer<typeof getQuizPresetSchema>;
export type GetQuizPresetBySearch = z.infer<typeof getQuizPresetBySearchSchema>;
export type DeleteQuizPreset = z.infer<typeof deleteQuizPresetSchema>;
