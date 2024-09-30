import { z } from 'zod';
import { groupEventSchema, groupSchema, groupSchemaWithEvents, groupStatusSchema } from './schemas';

export type GroupT = z.infer<typeof groupSchema>;

export type GroupEventT = z.infer<typeof groupEventSchema>;

export type GroupStatusT = z.infer<typeof groupStatusSchema>;

export type GroupWithEvents = z.infer<typeof groupSchemaWithEvents>;
