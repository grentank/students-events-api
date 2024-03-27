export const groupStatuses = [
  'На 0 фазе',
  'На 1 фазе',
  'На 2 фазе',
  'На 3 фазе',
  'Выпустилась',
] as const;

export type GroupStatusType = (typeof groupStatuses)[number];
