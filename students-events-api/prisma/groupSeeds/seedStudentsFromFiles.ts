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
    const [firstName, lastName, secondName] = name.split(' ');
    const student = await prisma.student.findFirst({ where: { firstName, lastName, secondName } });
    if (!student) throw new Error(`Студент ${name} не найден!`);
    const eventObjects = events.map((event) => ({
      studentId: student.id,
      statusId: Number(event.split(' ')[1]),
      createdAt: new Date(event.split(' ')[0]),
    }));
    await prisma.studentEvent.createMany({
      data: addExamEvents(eventObjects),
    });
  }
}

function addExamEvents(
  events: { studentId: number; statusId: number; createdAt: Date }[],
): { studentId: number; statusId: number; createdAt: Date }[] {
  const newEvents = [...events];
  for (let index = 0; index < events.length; index++) {
    const event = events[index];
    const { studentId, createdAt, statusId } = event;
    // Экзамен на 1 фазе проходит на 5 дней раньше, чем перевод на 2-ую
    if (statusId === 3 || statusId === 6 || statusId === 10) {
      const eventDate = new Date(createdAt);
      eventDate.setDate(createdAt.getDate() - 5);
      newEvents.push({ studentId, statusId: statusId === 3 ? 29 : 33, createdAt: eventDate });
    }
    // Экзамен на 2 фазе проходит на 4 дня раньше (четверг), чем перевод на 2-ую
    if (statusId === 4 || statusId === 7 || statusId === 11) {
      const eventDate = new Date(createdAt);
      eventDate.setDate(createdAt.getDate() - 4);
      newEvents.push({ studentId, statusId: statusId === 4 ? 30 : 34, createdAt: eventDate });
    }
    // Успешный экзамен на 3 фазе за 12 дней до карьерки
    if (statusId === 17) {
      const eventDate = new Date(createdAt);
      eventDate.setDate(createdAt.getDate() - 12);
      newEvents.push({ studentId, statusId: 31, createdAt: eventDate });
    }
    // Неуспешный экзамен на 3 фазе (даже если повтор) за 5 дней до сп и за 12 дней до повтора
    if (statusId === 12 || statusId === 8) {
      const eventDate = new Date(createdAt);
      eventDate.setDate(createdAt.getDate() - (statusId === 12 ? 5 : 12));
      newEvents.push({ studentId, statusId: 35, createdAt: eventDate });
    }
    // Проверка на каникулы, которые могли быть до перевода на следующую фазу
    if (
      events[index - 1] &&
      events[index - 1].statusId === 20 &&
      events[index - 2] &&
      events[index - 2].statusId === 23
    ) {
      if (events[index - 2].createdAt.getDate() === 25) {
        newEvents.at(-1).createdAt.setDate(newEvents.at(-1).createdAt.getDate() - 14);
      }
    }
  }
  // Тут нужно ещё добавить проверку насчёт попадания экзамена на каникулы
  // но пока исправлю вручную в веб-интерфейсе, как прикручу
  return newEvents;
}

export default async function seedStudentsFromFiles(prisma: PrismaClient) {
  const filenames = await readdir('./prisma/data/students');
  await Promise.all(filenames.map((filename) => seedStudentsFile(filename, prisma)));
}
