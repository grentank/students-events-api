import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default function generateTokens<T = string>(sub: T) {
  return {
    authToken: jwt.sign({ sub }, process.env.TOKEN_SECRET, { expiresIn: '7d' }),
  };
}
