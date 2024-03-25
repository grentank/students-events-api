import type { RequestHandler } from 'express';
import pipeCookie from '../utils/pipes/pipeCookie';
import getSubject from '../utils/jwt/getSubject';

const verifyAuthToken =
  (cookieName: string): RequestHandler =>
  (req, res, next) => {
    try {
      const authToken = pipeCookie(cookieName, req);
      const userId = getSubject(authToken);
      res.locals.userId = userId;
      return next();
    } catch (error) {
      console.log('Verification failed. Original error:', error);
      return res.status(401).send('Unauthorized');
    }
  };

export default verifyAuthToken;
