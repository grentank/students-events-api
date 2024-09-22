import { Module } from '@nestjs/common';
import { StudentService } from './students/students.service';
import { PrismaService } from './prisma.service';
import { StudentsController } from './students/students.controller';
import { GroupsController } from './groups/groups.controller';
import { GroupsService } from './groups/groups.service';
import { StudentsEventsService } from './studentsEvents/studentsEvents.service';
import { StudentsEventsController } from './studentsEvents/studentsEvents.controller';

@Module({
  imports: [],
  controllers: [StudentsController, GroupsController, StudentsEventsController],
  providers: [PrismaService, StudentService, GroupsService, StudentsEventsService],
})
export class AppModule {}
