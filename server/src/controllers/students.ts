import type { PrismaClient } from '@prisma/client';
import type { RequestHandler } from 'express';
import prismaDb from '../db';
import type { StudentService } from '../services/students';
import studentService from '../services/students';

class StudentsController {
  constructor(
    private db: PrismaClient,
    private service: StudentService,
  ) {}

  public getAllActive: RequestHandler = async (req, res) => {
    const activeStudents = await this.service.getAllActiveStudents();
    res.json(activeStudents);
  };
}

const studentsController = new StudentsController(prismaDb, studentService);

export default studentsController;
