import type { StudentStatusString } from '../types/status';
import { studentStatuses } from '../types/status';

export default function isStudentStatus(status: string): status is StudentStatusString {
  return studentStatuses.includes(status as StudentStatusString);
}
