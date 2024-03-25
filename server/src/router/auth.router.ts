import { Router } from 'express';
import tokensController from '../controllers/tokens';
import authController from '../controllers/auth';

const authRouter = Router();

authRouter.post('/signup', authController.signUp, tokensController.issueTokens);
authRouter.post('/login', authController.logIn, tokensController.issueTokens);
authRouter.get('/check', tokensController.checkAuth);
authRouter.get('/logout', tokensController.clearTokens);

export default authRouter;
