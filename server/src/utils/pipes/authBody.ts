import { z } from 'zod';

const authBody = z.object({
  email: z.string().email().min(3),
  password: z.string().min(8),
  secret: z.string(),
});

export default authBody;
