import { z } from 'zod';
import { studentEventSchema, studentStatusSchema } from './schemas';

export type StudentEventT = z.infer<typeof studentEventSchema>;

export type StudentStatusT = z.infer<typeof studentStatusSchema>;
