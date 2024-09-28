import { Controller, Get, Param } from '@nestjs/common';
import { Group, GroupStatus } from '@prisma/client';
import { GroupStatusService } from './groupStatus.service';

@Controller('groupStatus')
export class GroupStatusController {
  constructor(private readonly service: GroupStatusService) {}

  @Get()
  getGroupStatuses(): Promise<GroupStatus[]> {
    return this.service.statuses();
  }

  @Get(':status/groups')
  getGroupsByStatus(@Param('id') id): Promise<Group> {
    return this.service.groupByStatus(id);
  }
}
