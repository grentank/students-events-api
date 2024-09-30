import { Injectable } from '@nestjs/common';
import { StudentEvent } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StudentsEventsService {
  constructor(private prisma: PrismaService) {}

  async getEventsByStudentId(studentId: number): Promise<StudentEvent[]> {
    const events = await this.prisma.studentEvent.findMany({
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
    return events.sort(
      (e1, e2) => e1.createdAt.getTime() - e2.createdAt.getTime() || e1.id - e2.id,
    );
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
