import type { PrismaClient } from '@prisma/client';
import { studentStatuses } from '../../utils/types/status';

export default async function mainSeed(prisma: PrismaClient) {
  await prisma.status.createMany({
    data: studentStatuses.map((title) => ({ title })),
  });
}
