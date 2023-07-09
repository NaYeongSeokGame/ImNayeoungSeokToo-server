/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

type WrapperFunc = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>;

/**
 * 모든 오류를 catch() 처리하고 이를 next() 미들웨어에 전달하는 함수
 * ErrorHandler 에서 추후에 일괄적으로 오류를 처리할 예정.
 *
 * @params 비동기 처리를 진행할 함수 fn
 */

export const errorCatchHandler =
  (fn: WrapperFunc) =>
  (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next);
  };
