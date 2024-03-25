import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import type { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import authBody from '../utils/pipes/authBody';
import prismaDb from '../db';

class AuthController {
  constructor(private db: PrismaClient) {}

  public signUp: RequestHandler = async (req, res, next) => {
    try {
      const { email, password, secret } = authBody.parse(req.body);

      const userExists = await this.db.user.findFirst({ where: { email } });
      if (userExists) return res.status(403).json({ message: 'Email already exists' });
      if (secret !== process.env.SECRET_AUTH_PASSPHRASE)
        return res.status(403).json({ message: 'Secret key is incorrect' });

      const hashpass = await bcrypt.hash(password, 10);
      const user = await this.db.user.create({ data: { email, hashpass } });
      res.locals.userId = user.id;
      return next();
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  };

  public logIn: RequestHandler = async (req, res, next) => {
    try {
      const { email, password } = authBody.parse(req.body);
      if (!email || !password)
        return res.status(401).json({ message: 'All fields must be present' });

      const user = await this.db.user.findFirst({ where: { email } });
      if (!user) return res.status(401).json({ message: 'User not found' });

      const valid = await bcrypt.compare(password, user.hashpass);
      if (!valid) return res.status(401).json({ message: 'Incorrect password' });
      res.locals.userId = user.id;
      return next();
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  };
}

const authController = new AuthController(prismaDb);

export default authController;
