import { Injectable } from '@nestjs/common';
import { Group, GroupStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { GroupStatusText } from './groupStatus.schema';

@Injectable()
export class GroupStatusService {
  constructor(private prisma: PrismaService) {}

  async statuses(): Promise<GroupStatus[]> {
    return this.prisma.groupStatus.findMany();
  }

  async groupByStatus(statusText: Exclude<GroupStatusText, 'Выпустилась'>): Promise<Group> {
    const allGroups = await this.prisma.group.findMany({
      include: {
        events: {
          include: {
            status: true,
          },
        },
      },
    });
    const targetGroup = allGroups.find((group) => {
      const latestEvent = [...group.events].sort((e1, e2) => e2.id - e1.id).at(0);
      return latestEvent?.status.text === statusText;
    });
    return targetGroup;
  }
}
