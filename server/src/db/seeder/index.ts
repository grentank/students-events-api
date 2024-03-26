import type { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { readFileSync } from 'fs';
import type { StudentStatusString } from '../../utils/types/status';
import { studentStatuses } from '../../utils/types/status';

function parseBonusStudents(filename: string) {
  return readFileSync(filename, 'utf8')
    .split('\n')
    .map((row) => {
      const [name, email, git] = row.split('\t');
      const [firstName, lastName] = name.split(' ');
      return { firstName, lastName, email, git };
    });
}

export default async function mainSeed(prisma: PrismaClient) {
  // STATUSES
  await prisma.status.createMany({
    data: studentStatuses.map((title) => ({ title })),
  });
  const statuses = await prisma.status.findMany();
  const fStatusId = (title: StudentStatusString) =>
    statuses.find((status) => status.title === title)?.id as number;

  // USERS
  await prisma.user.create({
    data: {
      email: 'test@test',
      hashpass: hashSync('test', 5),
    },
  });

  // GROUPS
  const groupNames = ['Ожидание', 'Бобры-2024', 'Медведи-2024', 'Барсы-2024'] as const;
  await prisma.group.createMany({
    data: groupNames.map((name) => ({ name, codeUrl: '#', playlistUrl: '#' })),
  });
  const groups = await prisma.group.findMany();
  const fGroupId = (groupName: (typeof groupNames)[number]) =>
    groups.find((group) => group.name === groupName)?.id as number;

  // STUDENTS
  const fileNames = ['./beaversBonus.txt', './bearsBonus.txt', './leopardsBonus.txt'];
  await prisma.student.createMany({
    data: fileNames
      .map(parseBonusStudents)
      .map((file, ind) =>
        file.map((st) => ({ ...st, currentGroupId: fGroupId(groupNames[ind + 1]) })),
      )
      .reduce((acc, file) => [...acc, ...file], []),
  });
}
