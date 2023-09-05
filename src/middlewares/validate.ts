import type { RequestHandler } from 'express';
import { type ZodSchema } from 'zod';

import { BadRequestError } from '@/utils/definedErrors';

export type RequestValidation<ParamsType, QueryType, BodyType> = ZodSchema<{
  params?: ParamsType;
  query?: QueryType;
  body?: BodyType;
}>;

export const midValidation: <
  ParamsType = unknown,
  QueryType = unknown,
  BodyType = unknown,
>(
  schemas: RequestValidation<ParamsType, QueryType, BodyType>,
) => RequestHandler<ParamsType, unknown, BodyType, QueryType> =
  (schema) => (req, res, next) => {
    const { body, params, query } = req;
    const parsed = schema.safeParse({ body, params, query });

    if (parsed.success) {
      const {
        body: parsedBody,
        params: parsedParams,
        query: parsedQuery,
      } = parsed.data;

      if (parsedBody) req.body = parsedBody;
      if (parsedParams) req.params = parsedParams;
      if (parsedQuery) res.locals = parsedQuery;

      return next();
    }

    const [
      {
        path: [errorSection, ...errorPath],
      },
    ] = parsed.error.issues;

    throw new BadRequestError(
      `${errorSection} - ${errorPath.join(
        '.',
      )} : 요청과 맞지 않는 값이 들어왔습니다.`,
    );
  };

export default midValidation;
