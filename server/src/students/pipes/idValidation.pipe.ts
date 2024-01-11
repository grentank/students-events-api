import { PipeTransform, Injectable } from '@nestjs/common';
import { StudentsService } from '../students.service';
import { Student } from '@prisma/client';

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<Student>> {
  constructor(private studentsService: StudentsService) {}

  async transform(value /*, metadata: ArgumentMetadata*/): Promise<Student> {
    const id = parseInt(value, 10);
    if (isNaN(id) || id < 1) return Promise.reject(new Error('Неверный формат id'));

    const targetStudent = await this.studentsService.findOne({
      id: Number(value),
    });
    if (!targetStudent) return Promise.reject(new Error('Такого студента не существует'));

    return targetStudent;
  }
}
