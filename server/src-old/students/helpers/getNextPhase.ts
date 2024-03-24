import { StatusString, phases } from '../types/status';
import isStatusString from './isStatusString';

export default function getNextPhase(currentStatus: StatusString): StatusString {
  const phaseNumbers = phases.map((phase) => phase.slice(-1)); // ['0', '1', '2', '3']

  const currentPhaseNumber = phaseNumbers.indexOf(currentStatus.slice(-1));
  if (currentPhaseNumber === -1)
    throw new Error('Студент не учится, поэтому невозможно перевести на следующую фазу');

  if (currentStatus.slice(-1) === phaseNumbers.at(-1)) return 'Выпускник';

  const nextPhaseStatus = `Учится на фазе ${currentPhaseNumber + 1}`;
  if (!isStatusString(nextPhaseStatus))
    throw new Error('Невозможно перевести на следующую фазу (непредвиденная ошибка)');

  return nextPhaseStatus;
}
