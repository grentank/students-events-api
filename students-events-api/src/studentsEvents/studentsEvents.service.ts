import { Injectable } from '@nestjs/common';
import { StudentEvent } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StudentsEventsService {
  constructor(private prisma: PrismaService) {}

  async getEventsByStudentId(studentId: number): Promise<StudentEvent[]> {
    return this.prisma.studentEvent.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        status: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getEventsByStudentsName(firstName: string, lastName: string): Promise<StudentEvent[]> {
    return this.prisma.studentEvent.findMany({
      where: {
        student: {
          firstName: firstName,
          lastName: lastName,
        },
      },
    });
  }
}
