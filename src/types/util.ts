import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

export type PaginatedType<T = unknown> = { page: number; limit: number } & T;
export interface RequestQuery {
  [key: string]:
    | Query[string]
    | number
    | number[]
    | boolean
    | boolean[]
    | string
    | string[]
    | RequestQuery
    | RequestQuery[];
}

export type ValidationSchema = {
  query?: RequestQuery;
  params?: ParamsDictionary;
  body?: Record<string, unknown> | Record<string, unknown>[];
};

export type ValidatedRequest<T extends ValidationSchema> = Request<
  T['params'],
  unknown,
  T['body'],
  T['query']
>;

export type ValidatedRequestHandler<T extends ValidationSchema> = (
  req: ValidatedRequest<T>,
  res: Response,
  next: NextFunction,
) => Promise<Response>;
