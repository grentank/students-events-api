import { Router } from 'express';
import toSync from '../controllers/toSync';
import tokensController from '../controllers/tokens';
import authController from '../controllers/auth';

const authRouter = Router();

authRouter.post('/signup', toSync(authController.signUp), tokensController.issueTokens);
authRouter.post('/login', toSync(authController.logIn), tokensController.issueTokens);
authRouter.get('/logout', tokensController.clearTokens);

authRouter.get('/check', verifyRefreshToken, (req, res) => {
  res.json({ user: res.locals.user });
});

export default authRouter;
