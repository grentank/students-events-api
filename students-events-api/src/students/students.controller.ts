import { Controller, Get } from '@nestjs/common';
import { StudentService } from './students.service';
import { Student } from '@prisma/client';

@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentService) {}

  @Get()
  getAllStudents(): Promise<Student[]> {
    return this.service.students({});
  }
}
