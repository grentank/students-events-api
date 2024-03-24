import { Injectable } from '@nestjs/common';
import { Prisma, Student } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import getNextPhase from './helpers/getNextPhase';
import isStatusString from './helpers/isStatusString';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  createStudent(data: Prisma.StudentCreateInput) {
    return this.prisma.student.create({ data });
  }

  findOne(studentWhereInput: Prisma.StudentWhereInput) {
    return this.prisma.student.findFirst({ where: studentWhereInput });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StudentWhereUniqueInput;
    where?: Prisma.StudentWhereInput;
    orderBy?: Prisma.StudentOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.student.findMany({ skip, take, cursor, where, orderBy });
  }

  async toNextPhase(studentId: Student['id']) {
    const currentStudent = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        events: {
          include: { status: true },
        },
      },
    });
    if (!currentStudent) return Promise.reject(new Error('Такого студента не существует'));

    const studentCurrentStatus = currentStudent.events.at(-1).status.title;

    if (!isStatusString(studentCurrentStatus))
      throw new Error('Статус студента из БД не совпадает ни с одним из статусов в типах');

    const nextPhase = getNextPhase(studentCurrentStatus);

    const newPhaseStatus = await this.prisma.status.findFirst({
      where: { title: nextPhase },
    });

    return this.prisma.studentEvent.create({
      data: {
        studentId,
        statusId: newPhaseStatus.id,
      },
    });
  }
}
