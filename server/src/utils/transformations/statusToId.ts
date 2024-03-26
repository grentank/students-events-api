import db from '../../db';
import type { StudentStatusString } from '../types/status';

export default async function statusToId(status: StudentStatusString) {
  const targetStatus = await db.status.findUniqueOrThrow({
    where: {
      title: status,
    },
  });
  return targetStatus.id;
}
