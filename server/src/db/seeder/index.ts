import type { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { studentStatuses } from '../../utils/types/status';

export default async function mainSeed(prisma: PrismaClient) {
  await prisma.status.createMany({
    data: studentStatuses.map((title) => ({ title })),
  });
  await prisma.user.create({
    data: {
      email: 'test@test',
      hashpass: hashSync('test', 5),
    },
  });
  await prisma.student.createMany({
    data: [
      {firstName: }
    ]
  })
}
