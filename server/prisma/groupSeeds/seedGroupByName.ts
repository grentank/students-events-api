import { PrismaClient } from '@prisma/client';

const { readFile, readdir } = require('fs/promises');

async function seedGroupByName(groupName: string, prisma: PrismaClient) {
  const fileData = await readFile(`./prisma/data/groups/${groupName}`, 'utf8');
  const [groupData, studentsData] = fileData.split('\n\n');
  const [name, playlistUrl, codeUrl, creationDate] = groupData.split('\n');
  const group = await prisma.group.create({
    data: {
      name,
      playlistUrl,
      codeUrl,
      createdAt: new Date(creationDate),
    },
  });
  await prisma.student.createMany({
    data: studentsData.split('\n').map((row) => ({
      firstName: row.split('\t')[0].split(' ')[0],
      lastName: row.split('\t')[0].split(' ')[1],
      secondName: row.split('\t')[0].split(' ')[2],
      email: row.split('\t')[1],
      git: row.split('\t')[2],
      currentGroupId: group.id,
    })),
  });
  console.log(`${groupName} created`);
}

export default async function seedGroupsFromDataFolder(prisma: PrismaClient) {
  const filenames = await readdir('./prisma/data/groups', 'utf8');
  return Promise.all(filenames.map((filename) => seedGroupByName(filename, prisma)));
}
