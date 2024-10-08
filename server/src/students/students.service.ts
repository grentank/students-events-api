import { Injectable } from '@nestjs/common';
import { Prisma, Student } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

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

  async getActive(): Promise<Student[]> {
    function generateActiveWeeks(students) {
      const startDate = new Date('2024-01-01'); // Начало с 1 января 2024 года (понедельник)
      const endDate = new Date('2024-10-14'); // Последний понедельник, который нужно обработать
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // Количество миллисекунд в одной неделе

      // Функция для определения активности студента на основе его событий
      const isActive = (statusId) =>
        (statusId >= 2 && statusId <= 8) || statusId === 20 || (statusId >= 28 && statusId <= 31);

      return students.map((student) => {
        const activeWeeks = [];
        let currentDate = new Date(startDate);

        // Пробегаем по всем понедельникам до 7 октября 2024 года
        while (currentDate <= endDate) {
          const weekEvents = student.events.filter(
            (event) => (new Date(event.createdAt) <= currentDate) && (event.statusId < 28),
          );

          const lastEvent = weekEvents[weekEvents.length - 1]; // Последнее событие на текущий момент

          const active = lastEvent ? isActive(lastEvent.statusId) : false;

          activeWeeks.push({
            date: new Date(currentDate),
            active: active,
          });

          // Переходим на следующую неделю
          currentDate = new Date(currentDate.getTime() + oneWeek);
        }

        // Добавляем новое свойство для каждого студента
        return {
          ...student,
          activeWeeks,
        };
      });
    }
    const students = await this.prisma.student.findMany({ include: { events: true } });
    const activeStuds = generateActiveWeeks(
      students.map((s) => {
        s.events.sort((e1, e2) => e1.createdAt.valueOf() - e2.createdAt.valueOf());
        return s;
      }),
    );
    function countActiveStudentsPerWeek(students) {
      // Предполагается, что у всех студентов одинаковый диапазон недель в `activeWeeks`
      const numberOfWeeks = students[0].activeWeeks.length;

      // Инициализируем массив для хранения количества активных студентов на каждую неделю
      const activeCounts = Array(numberOfWeeks).fill(0);

      // Пробегаем по каждому студенту и по каждой неделе
      console.log(students);
      students.forEach((student) => {
        student.activeWeeks.forEach((week, index) => {
          if (week.active) {
            activeCounts[index] += 1;
          }
        });
      });

      return activeCounts;
    }
    return countActiveStudentsPerWeek(activeStuds);
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
