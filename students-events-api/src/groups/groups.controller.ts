import { Controller, Get } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from '@prisma/client';

@Controller('groups')
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  @Get()
  getAllGroups(): Promise<Group[]> {
    return this.service.groups({});
  }
}
