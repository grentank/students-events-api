import { z } from 'zod';
import { studentSchema } from './schemas';

export type StudentT = z.infer<typeof studentSchema>;
