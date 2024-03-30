// Процессы

export const studentsProcesses = [
  'Учится',
  'Повтор',
  'Самоподготовка',
  'Академ',
  'Отчислен',
] as const;

export type ProcessString = (typeof studentsProcesses)[number];

export const studentsProcessesKeys = [
  'studying',
  'repeat',
  'selfprep',
  'academic',
  'expelled',
] as const;

export type ProcessStringKey = (typeof studentsProcessesKeys)[number];

// Фазы

export const phases = ['0', '1', '2', '3'] as const;

export type PhasesString = (typeof phases)[number];

// Экстра статусы

export const extras = ['Выпустился', 'Перевёлся в другое направление'] as const;

export type ExtraStatus = (typeof extras)[number];

export const extrasKeys = ['graduated', 'transferred'] as const;

export type ExtraStatusKey = (typeof extrasKeys)[number];

// Построение композитных типов статусов и enum

export type StudentStatusString = `${ProcessString} на фазе ${PhasesString}` | ExtraStatus;

export type StudentStatusKey = `${ProcessStringKey}${PhasesString}` | ExtraStatusKey;

export const studentStatuses = studentsProcesses
  .map((process) => phases.map((phase) => `${process} на фазе ${phase}`))
  .flat()
  .concat(extras) as StudentStatusString[];

export const studentStatusKeys = studentsProcessesKeys
  .map((process) => phases.map((phase) => `${process}${phase}`))
  .flat()
  .concat(extras) as StudentStatusKey[];

export const studentStatusesEnum = {
  ...studentStatuses.reduce(
    (acc, status, ind) => {
      acc[studentStatusKeys[ind]] = status;
      return acc;
    },
    {} as Record<StudentStatusKey, StudentStatusString>,
  ),
} as const;

// Перечисление вспомогательных статусов

export const activeStatuses = studentStatuses.filter(
  (status) => status.startsWith(studentsProcesses[0]) || status.startsWith(studentsProcesses[1]),
);

export const repeatStatuses = studentStatuses.filter((status) =>
  status.startsWith(studentsProcesses[1]),
);

export const selfprepStatuses = studentStatuses.filter((status) =>
  status.startsWith(studentsProcesses[2]),
);

export const nonActiveStatuses = studentStatuses.filter(
  (status) => status.startsWith(studentsProcesses[2]) || status.startsWith(studentsProcesses[3]),
);

export const expelledStatuses = studentStatuses.filter((status) =>
  status.startsWith(studentsProcesses[4]),
);
