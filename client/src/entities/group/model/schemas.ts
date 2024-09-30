import { z } from 'zod';

export const groupStatusSchema = z.object({
  id: z.number(),
  text: z.string(),
});

export const groupEventSchema = z.object({
  id: z.number(),
  groupId: z.number(),
  statusId: z.number(),
  status: groupStatusSchema,
});

export const groupSchema = z.object({
  id: z.number(),
  name: z.string(),
  playlistUrl: z.string(),
  codeUrl: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const groupSchemaWithEvents = groupSchema.extend({
  events: z.array(groupEventSchema),
});

// export const groupSchemaWithStudents = groupSchema.extend({
//   currentStudents: z.array(z.number()),
// });

// name            String    @unique
// playlistUrl     String
// codeUrl         String
// createdAt       DateTime  @default(now())
// updatedAt       DateTime  @updatedAt
// events          GroupEvent[]
// currentStudents Student[]
