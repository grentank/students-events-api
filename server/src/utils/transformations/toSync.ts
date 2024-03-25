import type { RequestHandler, Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const toSync =
  (handler: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch((err) => {
      throw err;
    });
  };

export default toSync;
