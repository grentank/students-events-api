import express from 'express';
import toSync from './utils/transformations/toSync';
import db from './db';

const app = express();

app.get(
  '/',
  toSync(async (req, res) => {
    const student = await db.student.findFirst({
      include: { group: true, events: { include: { status: true } } },
    });
  }),
);

app.listen(3000, () => {
  console.log('Server is running');
});
