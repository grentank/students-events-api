import type { Request, Response } from 'express';
import { z } from 'zod';
import generateTokens from '../utils/jwt/generateTokes';

class TokensController {
  constructor(private cookieName: string) {}

  public issueTokens = (req: Request, res: Response) => {
    const userIdSchema = z.number();
    const userId = userIdSchema.parse(res.locals.userId);
    const { authToken } = generateTokens(userId);
    res
      .status(200)
      .cookie(this.cookieName, authToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
  };

  public clearTokens = (req: Request, res: Response) => {
    res.clearCookie(this.cookieName).sendStatus(200);
  };

  public checkAuth = (req: Request, res: Response) => {
    const cookiesWithToken = z.object({
      [this.cookieName]: z.string(),
    });
    const { [this.cookieName]: authToken } = cookiesWithToken.parse(req.cookies);
  };
}

const tokensController = new TokensController('authToken');

export default tokensController;
