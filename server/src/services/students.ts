import type { PrismaClient } from '@prisma/client';
import prismaDb from '../db';
import type { PhasesString, ProcessString, StudentStatusString } from '../utils/types/status';
import statusToId from '../utils/transformations/statusToId';
import isStudentStatus from '../utils/guards/isStudentStatus';

class StudentService {
  public repeatingStatusTitles: StudentStatusString[] = [
    'Повтор на фазе 1',
    'Повтор на фазе 2',
    'Повтор на фазе 3',
  ];

  public studyingStatusTitles: StudentStatusString[] = [
    'Учится на фазе 1',
    'Учится на фазе 2',
    'Учится на фазе 3',
  ];

  constructor(private db: PrismaClient) {}

  public async getActiveStudents() {
    const activeStatusTitles = this.repeatingStatusTitles.concat(this.studyingStatusTitles);
    const activeStatusesIds = await Promise.all(activeStatusTitles.map(statusToId));
    const students = await this.db.student.findMany({
      include: {
        events: {
          where: {
            OR: activeStatusesIds.map((statusId) => ({ statusId })),
          },
        },
      },
    });
    return students;
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
