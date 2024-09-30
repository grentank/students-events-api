import { Controller, Get, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group, Student } from '@prisma/client';

@Controller('groups')
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  @Get()
  getAllGroups(): Promise<Group[]> {
    return this.service.groups({});
  }

  @Get(':id/students')
  getGroupStudents(@Param('id') id): Promise<Student[]> {
    return this.service.studentsByGroupId(Number(id));
  }
}
