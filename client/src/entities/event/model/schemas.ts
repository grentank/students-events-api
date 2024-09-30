import { z } from 'zod';

export const studentStatusSchema = z.object({
  id: z.number(),
  text: z.string(),
});

export const studentEventSchema = z.object({
  id: z.number(),
  comment: z.string().nullable(),
  studentId: z.number(),
  statusId: z.number(),
  createdAt: z.string(),
  status: studentStatusSchema,
});
