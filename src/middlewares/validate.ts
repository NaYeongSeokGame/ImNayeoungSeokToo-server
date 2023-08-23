import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export type RequestSchema = z.ZodObject<{
  params?: z.ZodObject<Record<string, z.ZodTypeAny>>;
  query?: z.ZodObject<Record<string, z.ZodTypeAny>>;
  body?: z.ZodObject<Record<string, z.ZodTypeAny>>;
}>;

const midValidate =
  <T extends RequestSchema>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { params, body, query } = req;
    const result = (await schema.safeParseAsync({
      params,
      body,
      query,
    })) as z.SafeParseReturnType<
      T,
      {
        params?: Record<string, string>;
        query?: Record<string, unknown>;
        body?: Record<string, unknown> | Record<string, unknown>[];
      }
    >;

    if (!result.success) return next(result.error);
    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) res.locals = result.data.query;
  };

export default midValidate;
