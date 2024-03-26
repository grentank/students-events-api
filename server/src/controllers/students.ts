import type { PrismaClient } from '@prisma/client';
import prismaDb from '../db';
import statusToId from '../utils/transformations/statusToId';
import type { StudentStatusString } from '../utils/types/status';

class StudentsController {
  constructor(private db: PrismaClient) {}
}

const studentsController = new StudentsController(prismaDb);

export default studentsController;
