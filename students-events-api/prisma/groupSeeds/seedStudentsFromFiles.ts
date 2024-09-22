import { PrismaClient } from '@prisma/client';
const { readdir, readFile } = require('fs/promises');

async function seedStudentsFile(filename, prisma: PrismaClient) {
  const fileData = await readFile(`./prisma/data/students/${filename}`, 'utf8');
  // const creationPromises = fileData.split('\n').map(async (row) => {
  //   const [name, ...events] = row.split(';');
  //   const [firstName, lastName] = name.split(' ');
  //   const student = await prisma.student.findFirst({ where: { firstName, lastName } });
  //   if (!student) throw new Error(`Студент ${name} не найден!`);
  //   await prisma.studentEvent.createMany({
  //     data: events.map((event) => ({
  //       studentId: student.id,
  //       statusId: Number(event.split(' ')[1]),
  //       createdAt: new Date(event.split(' ')[0]),
  //     })),
  //   });
  // });
  // await Promise.all(creationPromises);

  // Через Promise.all БД не успевает обработать все запросы
  // приходится писать через for
  const rows = fileData.split('\n');
  for (const row of rows) {
    const [name, ...events] = row.split(';');
    const [firstName, lastName] = name.split(' ');
    const student = await prisma.student.findFirst({ where: { firstName, lastName } });
    if (!student) throw new Error(`Студент ${name} не найден!`);
    await prisma.studentEvent.createMany({
      data: events.map((event) => ({
        studentId: student.id,
        statusId: Number(event.split(' ')[1]),
        createdAt: new Date(event.split(' ')[0]),
      })),
    });
  }
}

export default async function seedStudentsFromFiles(prisma: PrismaClient) {
  const filenames = await readdir('./prisma/data/students');
  await Promise.all(filenames.map((filename) => seedStudentsFile(filename, prisma)));
}
