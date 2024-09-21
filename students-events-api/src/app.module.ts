import { Module } from '@nestjs/common';
import { StudentService } from './students/students.service';
import { PrismaService } from './prisma.service';
import { StudentsController } from './students/students.controller';
import { GroupsController } from './groups/groups.controller';
import { GroupsService } from './groups/groups.service';

@Module({
  imports: [],
  controllers: [StudentsController, GroupsController],
  providers: [PrismaService, StudentService, GroupsService],
})
export class AppModule {}
