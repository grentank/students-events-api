// Статусы не могут поменяться.
// Приходится так расписать, чтобы воспользоваться силой as const в тайпскрипте
// Генерация данного массива программно возможна, но в таком случае часто typescript переделывает
// конкретное сочетание id-text в id-string или просто забывает про конкретный текст

export const studentStatuses = [
  { id: 1, text: 'Учится на 0 фазе' },
  { id: 2, text: 'Учится на 1 фазе' },
  { id: 3, text: 'Учится на 2 фазе' },
  { id: 4, text: 'Учится на 3 фазе' },
  { id: 5, text: 'Повтор на 0 фазе' },
  { id: 6, text: 'Повтор на 1 фазе' },
  { id: 7, text: 'Повтор на 2 фазе' },
  { id: 8, text: 'Повтор на 3 фазе' },
  { id: 9, text: 'Самоподготовка на 0 фазе' },
  { id: 10, text: 'Самоподготовка на 1 фазе' },
  { id: 11, text: 'Самоподготовка на 2 фазе' },
  { id: 12, text: 'Самоподготовка на 3 фазе' },
  { id: 13, text: 'Академический отпуск на 0 фазе' },
  { id: 14, text: 'Академический отпуск на 1 фазе' },
  { id: 15, text: 'Академический отпуск на 2 фазе' },
  { id: 16, text: 'Академический отпуск на 3 фазе' },
  { id: 17, text: 'Карьерная неделя' },
  { id: 18, text: 'Выпустился' },
  { id: 19, text: 'Перевод в другое направление' },
  { id: 20, text: 'Продолжение учёбы после паузы' },
  { id: 21, text: 'Возврат денег' },
  { id: 22, text: 'Отчисление по иным причинам' },
  { id: 23, text: 'Каникулы' },
  { id: 24, text: 'Отчисление с 0 фазы за экзамен' },
  { id: 25, text: 'Отчисление с 1 фазы за экзамен' },
  { id: 26, text: 'Отчисление с 2 фазы за экзамен' },
  { id: 27, text: 'Отчисление с 3 фазы за экзамен' },
] as const;

export type StudentStatusReadonly = typeof studentStatuses;

export type StudentStatusText = (typeof studentStatuses)[number]['text'];

export enum StudentStatusTextEnum {
  study0 = 'Учится на 0 фазе',
  study1 = 'Учится на 1 фазе',
  study2 = 'Учится на 2 фазе',
  study3 = 'Учится на 3 фазе',
  repeat0 = 'Повтор на 0 фазе',
  repeat1 = 'Повтор на 1 фазе',
  repeat2 = 'Повтор на 2 фазе',
  repeat3 = 'Повтор на 3 фазе',
  self0 = 'Самоподготовка на 0 фазе',
  self1 = 'Самоподготовка на 1 фазе',
  self2 = 'Самоподготовка на 2 фазе',
  self3 = 'Самоподготовка на 3 фазе',
  vacation0 = 'Академический отпуск на 0 фазе',
  vacation1 = 'Академический отпуск на 1 фазе',
  vacation2 = 'Академический отпуск на 2 фазе',
  vacation3 = 'Академический отпуск на 3 фазе',
  career = 'Карьерная неделя',
  expelled = 'Выпустился',
  transfer = 'Перевод в другое направление',
  continueStudy = 'Продолжение учёбы после паузы',
  refund = 'Возврат денег',
  dropout = 'Отчисление по иным причинам',
  holidays = 'Каникулы',
  dropoutExam0 = 'Отчисление с 0 фазы за экзамен',
  dropoutExam1 = 'Отчисление с 1 фазы за экзамен',
  dropoutExam2 = 'Отчисление с 2 фазы за экзамен',
  dropoutExam3 = 'Отчисление с 3 фазы за экзамен',
}

export function stringIsStudentStatus(str: string): str is StudentStatusText {
  return studentStatuses.some((status) => status.text === str);
}

export const activeStatuses = studentStatuses.slice(0, 8).map((s) => s.text);

export function isStudentStatusActive(status: StudentStatusText) {
  return activeStatuses.includes(status);
}
