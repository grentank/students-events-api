import { z } from "zod";

export const studentSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    secondName: z.number().nullable(),
    git: z.string(),
    telegram: z.string().nullable(),
    comment: z.string().nullable(),
    currentGroupId: z.number(),
    group: z.object({
        id: z.number(),
        name: z.string(),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
    events: z.array(z.object({
        id: z.number(),
        name: z.string(),
        date: z.date(),
    })),
    bonuses: z.array(z.object({
        id: z.number(),
        score: z.number(),
        reason: z.string(),
        date: z.date(),
    })),
});
    // id                Int       @id @default(autoincrement())
    // firstName         String
    // lastName          String
    // secondName        String?
    // git               String    @unique
    // email             String    @unique
    // telegram          String?
    // comment           String?
    // currentGroupId    Int
    // group             Group     @relation(fields: [currentGroupId], references: [id])
    // createdAt         DateTime  @default(now())
    // updatedAt         DateTime  @updatedAt
    // events            StudentEvent[]
    // bonuses           BonusScore[]