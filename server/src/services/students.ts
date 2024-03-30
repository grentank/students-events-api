import type { PrismaClient, Status, Student } from '@prisma/client';
import prismaDb from '../db';
import {
  activeStatuses,
  selfprepStatuses,
  type PhasesString,
  type ProcessString,
  type StudentStatusString,
} from '../utils/types/status';
import statusToId from '../utils/transformations/statusToId';
import isStudentStatus from '../utils/guards/isStudentStatus';

export class StudentService {
  constructor(private db: PrismaClient) {}

  public async getAllActiveStudents() {
    const students = await this.db.student.findMany({
      include: {
        events: {
          include: {
            status: true,
          },
        },
      },
    });
    students.forEach((student) => {
      student.events.sort((e1, e2) => e2.createdAt.valueOf() - e1.createdAt.valueOf());
    });
    return students.filter((student) => {
      const latestEventTitle = student.events.at(-1)?.status.title as StudentStatusString;
      return activeStatuses.includes(latestEventTitle);
    });
  }

  // public async getActiveStudents() {
  //   const activeStatusTitles = this.repeatingStatusTitles.concat(this.studyingStatusTitles);
  //   const activeStatusesIds = await Promise.all(activeStatusTitles.map(statusToId));
  //   const students = await this.db.student.findMany({
  //     include: {
  //       events: {
  //         where: {
  //           OR: activeStatusesIds.map((statusId) => ({ statusId })),
  //         },
  //       },
  //     },
  //   });
  //   return students;
  // }

  public async getActiveStudentsByPhase(phase: PhasesString) {
    const students = await this.db.student.findMany({
      include: {
        events: {
          include: {
            status: true,
          },
        },
      },
    });
    students.forEach((student) => {
      student.events.sort((e1, e2) => e2.createdAt.valueOf() - e1.createdAt.valueOf());
    });
    return students.filter((student) => {
      const latestEventTitle = student.events.at(-1)?.status.title as StudentStatusString;
      return activeStatuses.includes(latestEventTitle) && latestEventTitle.includes(phase);
    });
  }

  public async getStudentsOnSelfPrep() {
    const students = await this.db.student.findMany({
      include: {
        events: {
          include: {
            status: true,
          },
        },
      },
    });
    students.forEach((student) => {
      student.events.sort((e1, e2) => e2.createdAt.valueOf() - e1.createdAt.valueOf());
    });
    return students.filter((student) => {
      const latestEventTitle = student.events.at(-1)?.status.title as StudentStatusString;
      return selfprepStatuses.includes(latestEventTitle);
    });
  }

  public getStudent(studentId: Student['id']) {
    return this.db.student.findUnique({
      where: { id: studentId },
      include: {
        events: {
          include: {
            status: true,
          },
        },
      },
    });
  }

  public async createStudentEvent(
    studentId: Student['id'],
    statusId: Status['id'],
    date: Date = new Date(),
  ) {
    const day = date.getDay();
    if (day !== 0) {
      const diff = 7 - day;
      date.setDate(date.getDate() + diff);
      date.setHours(12);
    }
    const res = await this.db.studentEvent.create({
      data: {
        studentId,
        statusId,
        createdAt: date,
      },
    });
    return res;
  }

  public async getStudentsByPhase(phase: PhasesString) {
    const targetProcesses: ProcessString[] = ['Повтор', 'Учится'];
    const targetStatuses = targetProcesses.map((proc) => `${proc} на фазе ${phase}`);
    if (!targetStatuses.every(isStudentStatus)) {
      throw new Error('Неудачное формирование статусов по фазе');
    }
    const ids = await Promise.all(targetStatuses.map(statusToId));
    const students = await this.db.student.findMany({
      include: {
        events: {
          where: {
            OR: ids.map((id) => ({ statusId: id })),
          },
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
    });
    return students;
  }
}

const studentService = new StudentService(prismaDb);

export default studentService;
