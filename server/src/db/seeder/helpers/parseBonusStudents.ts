import { readFileSync } from 'fs';

export default function parseBonusStudents(filename: string) {
  return readFileSync(filename, 'utf8')
    .split('\n')
    .map((row) => {
      const [name, email, git] = row.split('\t');
      const [firstName, lastName] = name.split(' ');
      return { firstName, lastName, email, git };
    });
}
