import express from 'express';

const app = express();

app.use(express.static('public'));

app.get('/', (_, res) => {
  res.sendFile('menu.html', { root: 'public' });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
