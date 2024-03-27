import type { Group, Status, Student } from '@prisma/client';
import type { StudentStatusString } from '../../../utils/types/status';

export function fStatusId(title: StudentStatusString, statuses: Status[]) {
  const target = statuses.find((status) => status.title === title);
  if (!target) throw new Error('Статус не найден, id не вычислен');
  return target.id;
}

export const groupNames = ['Ожидание', 'Бобры-2024', 'Медведи-2024', 'Барсы-2024'] as const;

export function fGroupId(groupName: (typeof groupNames)[number], groups: Group[]) {
  const target = groups.find((group) => group.name === groupName);
  if (!target) throw new Error('Группа не найдена, id не вычислен');
  return target.id;
}

export function fStudentId(email: string, students: Student[]) {
  const target = students.find((student) => student.email === email);
  if (!target) throw new Error('Нет студента с таким email, id не вычислен');
  return target.id;
}
