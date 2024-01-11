export const processes = ['Учится', 'Повтор', 'Самоподготовка', 'Академ'] as const;

export type ProcessString = (typeof processes)[number];

export const phases = ['фазе 0', 'фазе 1', 'фазе 2', 'фазе 3'] as const;

export type PhasesString = (typeof phases)[number];

export const extras = ['Выпускник'] as const;

export type ExtraStatus = (typeof extras)[number];

export type StatusString = `${ProcessString} на ${PhasesString}` | ExtraStatus;

export const statuses = processes
  .map((process) => phases.map((phase) => `${process} на ${phase}`))
  .flat()
  .concat(extras) as StatusString[];
