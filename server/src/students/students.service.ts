import { Injectable } from '@nestjs/common';
import { Prisma, Student } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getStudentsByGroupId(groupId: number): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        currentGroupId: groupId,
      },
    });
  }

  async getStudentsByPhase(phase: number | string): Promise<Student[]> {
    const allGroups = await this.prisma.group.findMany({
      include: {
        events: true,
      },
    });
    return this.prisma.student.findMany({
      where: {},
    });
  }

  //   async user(
  //     userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  //   ): Promise<User | null> {
  //     return this.prisma.user.findUnique({
  //       where: userWhereUniqueInput,
  //     });
  //   }

  async students(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StudentWhereInput;
    orderBy?: Prisma.StudentOrderByWithRelationInput;
  }): Promise<Student[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.student.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  //   async createUser(data: Prisma.UserCreateInput): Promise<User> {
  //     return this.prisma.user.create({
  //       data,
  //     });
  //   }

  //   async updateUser(params: {
  //     where: Prisma.UserWhereUniqueInput;
  //     data: Prisma.UserUpdateInput;
  //   }): Promise<User> {
  //     const { where, data } = params;
  //     return this.prisma.user.update({
  //       data,
  //       where,
  //     });
  //   }

  //   async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
  //     return this.prisma.user.delete({
  //       where,
  //     });
  //   }
}
