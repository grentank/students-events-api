import type { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import type { StudentStatusString } from '../../utils/types/status';
import { studentStatuses } from '../../utils/types/status';
import parseBonusStudents from './helpers/parseBonusStudents';
import { fGroupId, groupNames } from './helpers/finders';

export default async function mainSeed(prisma: PrismaClient) {
  // STATUSES
  await prisma.status.createMany({
    data: studentStatuses.map((title) => ({ title })),
  });

  // USERS
  await prisma.user.create({
    data: {
      email: 'test@test',
      hashpass: hashSync('test', 5),
    },
  });

  // GROUPS
  await prisma.group.createMany({
    data: groupNames.map((name) => ({ name, codeUrl: '#', playlistUrl: '#' })),
  });
  const groups = await prisma.group.findMany();

  // STUDENTS
  const fileNames = ['./beaversBonus.txt', './bearsBonus.txt', './leopardsBonus.txt'];
  await prisma.student.createMany({
    data: fileNames
      .map(parseBonusStudents)
      .map((file, ind) =>
        file.map((st) => ({ ...st, currentGroupId: fGroupId(groupNames[ind + 1], groups) })),
      )
      .reduce((acc, file) => [...acc, ...file], []),
  });
}
