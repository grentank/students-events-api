export const groupStatuses = [
  { id: 1, text: '0 фаза' },
  { id: 2, text: '1 фаза' },
  { id: 3, text: '2 фаза' },
  { id: 4, text: '3 фаза' },
  { id: 5, text: 'Выпустилась' },
  { id: 6, text: 'Подготавливается' },
] as const;

export type GroupStatusText = (typeof groupStatuses)[number]['text'];

export type GroupStatusesReadonly = typeof groupStatuses;

export enum GropStatusTextEnum {
  phase0 = '0 фаза',
  phase1 = '1 фаза',
  phase2 = '2 фаза',
  phase3 = '3 фаза',
  graduated = 'Выпустилась',
  prep = 'Подготавливается',
}
