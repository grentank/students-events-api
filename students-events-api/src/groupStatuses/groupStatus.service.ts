import { Injectable } from '@nestjs/common';
import { Group, Prisma, Student } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GroupStatusService {
  constructor(private prisma: PrismaService) {}

  async group(userWhereUniqueInput: Prisma.GroupWhereUniqueInput): Promise<Group | null> {
    return this.prisma.group.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async groups(params: {
    skip?: number;
    take?: number;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput;
  }): Promise<Group[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.group.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async studentsByGroupId(groupId: number): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        currentGroupId: groupId,
      },
    });
  }
}
