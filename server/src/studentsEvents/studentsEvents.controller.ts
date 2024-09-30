import { Controller, Get, Param } from '@nestjs/common';
import { StudentEvent } from '@prisma/client';
import { StudentsEventsService } from './studentsEvents.service';

@Controller('events')
export class StudentsEventsController {
  constructor(private readonly service: StudentsEventsService) {}

  @Get('students/:id')
  getEventsByStudentId(@Param('id') studentId: string): Promise<StudentEvent[]> {
    return this.service.getEventsByStudentId(Number(studentId));
  }
}
