import { Injectable } from '@nestjs/common';
import { Prisma, Student, StudentEvent } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import fs from 'fs/promises';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getStudentsByGroupId(groupId: number): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        currentGroupId: groupId,
      },
    });
  }

  async getActive() {
    return null;
  }

  async getCampusLoad(): Promise<
    {
      students: string[];
      count: number;
      date: Date;
    }[]
  > {
    // function generateActiveWeeks(students) {
    const allStudentsWithEvents = await this.prisma.student.findMany({ include: { events: true } });
    // сортируем события в порядке времени у каждого студента от старых к новым
    const allStudentsWithSortedEvents = allStudentsWithEvents.map((s) => {
      s.events.sort((e1, e2) => e1.createdAt.valueOf() - e2.createdAt.valueOf());
      return s;
    });
    const startDate = new Date('2023-01-02'); // Начало с 2 января 2023 года (понедельник)
    const endDate = new Date('2024-11-18'); // Последний понедельник, который нужно обработать
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // Количество миллисекунд в одной неделе

    // Функция для определения активности студента на основе его событий
    const isActive = (statusId) =>
      (statusId >= 2 && statusId <= 8) || statusId === 20 || (statusId >= 28 && statusId <= 31);

    const studentsWithWeeks = allStudentsWithSortedEvents.map((student) => {
      const activeWeeks: { date: Date; active: boolean }[] = [];
      let currentlyActive = false;
      for (
        let currentDate = new Date(startDate);
        currentDate <= endDate;
        currentDate = new Date(currentDate.getTime() + oneWeek)
      ) {
        // const weekEvents = student.events.filter(
        //   (event) => new Date(event.createdAt) <= currentDate && event.statusId < 28,
        // );
        const weekEvents = student.events.filter(
          (event) =>
            new Date(event.createdAt).valueOf() === currentDate.valueOf() && event.statusId < 28,
        );
        if (!weekEvents.length)
          activeWeeks.push({ date: new Date(currentDate), active: currentlyActive });
        else if (weekEvents.length === 1) {
          currentlyActive = isActive(weekEvents[0].statusId);
          activeWeeks.push({ date: new Date(currentDate), active: currentlyActive });
        } else {
          const continueEvent = weekEvents.find((e) => e.statusId === 20);
          if (continueEvent) {
            const otherEvent = weekEvents.find((e) => e.statusId !== 20);
            currentlyActive = isActive(otherEvent.statusId);
            activeWeeks.push({ date: new Date(currentDate), active: currentlyActive });
          } else {
            const isStopId = (id: number): boolean =>
              (id >= 9 && id <= 16) || (id >= 21 && id <= 27) || id === 19;
            const stopEvent = weekEvents.find((e) => isStopId(e.statusId));
            currentlyActive = !stopEvent;
            activeWeeks.push({ date: new Date(currentDate), active: currentlyActive });
          }
        }

        // const lastEvent = weekEvents[weekEvents.length - 1]; // Последнее событие на текущий момент

        // const active = lastEvent ? isActive(lastEvent.statusId) : false;

        // activeWeeks.push({
        //   date: new Date(currentDate),
        //   active: active,
        // });
      }
      // let currentDate = new Date(startDate);

      // Пробегаем по всем понедельникам до 7 октября 2024 года
      // while (currentDate <= endDate) {

      // Переходим на следующую неделю
      // currentDate = new Date(currentDate.getTime() + oneWeek);
      // }

      // Добавляем новое свойство для каждого студента
      return {
        ...student,
        activeWeeks,
      };
    });
    // }
    // const activeStuds = generateActiveWeeks(
    //   students.map((s) => {
    //     s.events.sort((e1, e2) => e1.createdAt.valueOf() - e2.createdAt.valueOf());
    //     return s;
    //   }),
    // );
    // function countActiveStudentsPerWeek(students) {
    // Предполагается, что у всех студентов одинаковый диапазон недель в `activeWeeks`
    const numberOfWeeks = studentsWithWeeks[0].activeWeeks.length;

    // Инициализируем массив для хранения количества активных студентов на каждую неделю
    const activeCounts: { students: string[]; count: number; date: Date }[] = Array(numberOfWeeks)
      .fill(null)
      .map((_, ind) => ({
        students: [],
        count: 0,
        date: new Date(startDate.valueOf() + ind * oneWeek),
      }));

    // Пробегаем по каждому студенту и по каждой неделе
    // console.log(students);
    studentsWithWeeks.forEach((student) => {
      student.activeWeeks.forEach((week, index) => {
        if (week.active) {
          activeCounts[index].date = student.activeWeeks[index].date;
          activeCounts[index].count += 1;
          const fullName = student.secondName
            ? student.firstName + ' ' + student.lastName + ' ' + student.secondName
            : student.firstName + ' ' + student.lastName;
          if (!activeCounts[index].students.includes(fullName))
            activeCounts[index].students.push(fullName);
        }
      });
    });

    //   return activeCounts;
    // }
    await require('fs/promises').writeFile(
      'campusLoad.txt',
      activeCounts.map((c) => `${c.date?.getMonth?.()}\t${c.count}`).join('\n'),
      'utf8',
    );
    return activeCounts; //countActiveStudentsPerWeek(activeStuds);
  }

  async getExamAttempts() {
    const allStudentsWithEvents = await this.prisma.student.findMany({ include: { events: true } });
    const hasStudiedId = (id: number): boolean => id >= 2 && id <= 27;
    const studentsWithRepeats = allStudentsWithEvents
      .filter((student) => student.events.find((e) => hasStudiedId(e.statusId)))
      .map((student) => {
        const repeats = student.events.reduce(
          (a, e) => (e.statusId >= 33 && e.statusId <= 35 ? a + 1 : a),
          0,
        );
        const repeatsByPhase = [1, 2, 3].map(
          (phase) => student.events.filter((e) => e.statusId === 32 + phase).length,
        );
        return { ...student, repeats, repeatsByPhase };
      });
    const averageRepeats =
      studentsWithRepeats.reduce((a, s) => a + s.repeats, 0) / studentsWithRepeats.length;
    await require('fs/promises').writeFile(
      'repeats.txt',
      averageRepeats +
        '\n' +
        studentsWithRepeats
          .map((s) => `${s.repeats}\t${s.repeatsByPhase.join('\t')}\t${s.firstName} ${s.lastName}`)
          .join('\n'),
      'utf8',
    );
    return studentsWithRepeats.map(
      ({ firstName, lastName, repeats, repeatsByPhase, secondName }) => ({
        firstName,
        lastName,
        repeats,
        repeatsByPhase,
        secondName,
      }),
    );
  }

  async passesAndRepeats() {
    const allStudentsWithEvents = await this.prisma.student.findMany({ include: { events: true } });
    // const hasPassed2Phase = (events: StudentEvent[]) => !!events.find(({statusId}) => statusId === 4)
    const hasPassed2PhaseWithoutRepeats = (events: StudentEvent[]) =>
      events.find(({ statusId }) => statusId === 3) &&
      events.find(({ statusId }) => statusId === 4) &&
      events.every(({ statusId }) => statusId !== 7 && statusId !== 11);
    const hasNoRepeats = (events: StudentEvent[]) =>
      events.every(({ statusId }) => ![6, 7, 8, 10, 11, 12].includes(statusId));
    const hasFinishedEducation = (events: StudentEvent[]) =>
      !!events.find(({ statusId }) => statusId === 17);
    const hasFailed1PhaseAtLeastOnce = (events: StudentEvent[]) =>
      events.some(({ statusId }) => statusId === 10 || statusId === 6);
    const hasFailedOnOtherPhasesAfterFailingPhase1 = (events: StudentEvent[]) =>
      hasFailed1PhaseAtLeastOnce(events) &&
      events.some(({ statusId }) => [7, 8, 10, 11, 12].includes(statusId));
    const result = {
      hasPassed2PhaseWithoutRepeats: 0,
      hasNoRepeats: 0,
      hasRepeatsOnPhases1Or3: 0,
      hasFailed1PhaseAtLeastOnce: 0,
      hasFailedOnOtherPhasesAfterFailingPhase1: 0,
      hasNotFailedAfterPhase1: 0,
    };
    for (const student of allStudentsWithEvents) {
      const { events } = student;
      const passed2PhaseWithoutRepeats = hasPassed2PhaseWithoutRepeats(events);
      const noRepeats = hasNoRepeats(events);
      const finishedEducation = hasFinishedEducation(events);
      if (passed2PhaseWithoutRepeats && noRepeats && finishedEducation) {
        result.hasPassed2PhaseWithoutRepeats++;
        result.hasNoRepeats++;
      } else if (passed2PhaseWithoutRepeats && !noRepeats) {
        result.hasPassed2PhaseWithoutRepeats++;
        result.hasRepeatsOnPhases1Or3++;
      }

      const failed1PhaseAtLeastOnce = hasFailed1PhaseAtLeastOnce(events);
      const failedOnOtherPhasesAfterFailingPhase1 =
        hasFailedOnOtherPhasesAfterFailingPhase1(events);
      if (failed1PhaseAtLeastOnce && failedOnOtherPhasesAfterFailingPhase1) {
        result.hasFailed1PhaseAtLeastOnce++;
        result.hasFailedOnOtherPhasesAfterFailingPhase1++;
      } else if (
        failed1PhaseAtLeastOnce &&
        !failedOnOtherPhasesAfterFailingPhase1 &&
        finishedEducation
      ) {
        result.hasFailed1PhaseAtLeastOnce++;
        result.hasNotFailedAfterPhase1++;
      }
    }
    return result;
  }

  async getStudentsByPhase(phase: number | string): Promise<Student[]> {
    const allGroups = await this.prisma.group.findMany({
      include: {
        events: true,
      },
    });
    return this.prisma.student.findMany({
      where: {},
    });
  }

  //   async user(
  //     userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  //   ): Promise<User | null> {
  //     return this.prisma.user.findUnique({
  //       where: userWhereUniqueInput,
  //     });
  //   }

  async students(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StudentWhereInput;
    orderBy?: Prisma.StudentOrderByWithRelationInput;
  }): Promise<Student[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.student.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  //   async createUser(data: Prisma.UserCreateInput): Promise<User> {
  //     return this.prisma.user.create({
  //       data,
  //     });
  //   }

  //   async updateUser(params: {
  //     where: Prisma.UserWhereUniqueInput;
  //     data: Prisma.UserUpdateInput;
  //   }): Promise<User> {
  //     const { where, data } = params;
  //     return this.prisma.user.update({
  //       data,
  //       where,
  //     });
  //   }

  //   async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
  //     return this.prisma.user.delete({
  //       where,
  //     });
  //   }
}
