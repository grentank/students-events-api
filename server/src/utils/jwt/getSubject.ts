import { verify } from 'jsonwebtoken';
import 'dotenv/config';

export default function getSubject(token: string) {
  const payload = verify(token, process.env.TOKEN_SECRET);
  const userId = Number(payload.sub);
  if (!userId || typeof userId !== 'number' || Number.isNaN(userId)) {
    throw new Error('Invalid token');
  }
  return userId;
}
