export const studentsProcesses = ['Учится', 'Повтор', 'Самоподготовка', 'Академ'] as const;

export type ProcessString = (typeof studentsProcesses)[number];

export const phases = ['0', '1', '2', '3'] as const;

export type PhasesString = (typeof phases)[number];

export const extras = ['Выпускник'] as const;

export type ExtraStatus = (typeof extras)[number];

export type StudentStatusString = `${ProcessString} на фазе ${PhasesString}` | ExtraStatus;

export const studentStatuses = studentsProcesses
  .map((process) => phases.map((phase) => `${process} на фазе ${phase}`))
  .flat()
  .concat(extras) as StudentStatusString[];
