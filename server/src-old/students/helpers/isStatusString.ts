import { StatusString, statuses } from '../types/status';

export default function isStatusString(status: string): status is StatusString {
  for (let index = 0; index < statuses.length; index++) {
    if (statuses[index] === status) return true;
  }
  return false;
}
