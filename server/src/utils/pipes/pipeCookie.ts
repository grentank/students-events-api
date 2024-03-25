import type { Request } from 'express';
import { z } from 'zod';

export default function pipeCookie(cookieName: string, req: Request) {
  const cookieSchema = z.object({
    [cookieName]: z.string(),
  });
  const { cookieName: value } = cookieSchema.parse(req.cookies);
  return value;
}
