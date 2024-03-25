import type { RequestHandler } from 'express';
import { z } from 'zod';
import generateTokens from '../utils/jwt/generateTokes';
import verifyAuthToken from '../middlewares/verifyAuthToken';

class TokensController {
  constructor(private cookieName: string) {}

  public issueTokens: RequestHandler = (req, res) => {
    const userIdSchema = z.number();
    const userId = userIdSchema.parse(res.locals.userId);
    const { authToken } = generateTokens(userId);
    res
      .status(200)
      .cookie(this.cookieName, authToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
  };

  public clearTokens: RequestHandler = (req, res) => {
    res.clearCookie(this.cookieName).sendStatus(200);
  };

  public checkAuth: RequestHandler = (req, res) => {
    verifyAuthToken(this.cookieName)(req, res, () => res.status(200).send(res.locals.userId));
  };
}

const tokensController = new TokensController('authToken');

export default tokensController;
