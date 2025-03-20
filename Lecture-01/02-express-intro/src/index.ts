import express, { Request, Response } from 'express';
import { Todo } from './models/Todo';
import { Post } from './models/Post';
const app = express();

// Get router
// Type params
// req handles incoming request
// res handles the response back to the client
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

// req finns här men vi använder den inte
// app.get('/', (_, res: Response) => {
//   res.send('Hello world!');
// });

const todos: Todo[] = [
  new Todo('Handla mat'),
  new Todo('Städa'),
  new Todo('Diska'),
];

app.get('/todos', (_: Request, res: Response) => {
  res.json(todos);
});

const posts: Post[] = [
  new Post(
    'Det ligger något i handarbetet',
    'Snart är den i land, den största svenska vetenskapliga studien hittills av hur handarbete påverkar psykisk hälsa. Hemslöjd har fåt en tidig intervju med forskaren bakom, som nu har börjat analysera siffrorna.',
    'Malin Vessby'
  ),
  new Post(
    'Tjusigast på Kyrkbacken!',
    'Smuggelgods, skrytplagg och en snygg silhuett. Hör berättelsen om livstycket. Bondesamhällets egen gucciväska.',
    'Kristina Lindh'
  ),
  new Post(
    'Gör din tröja till en vän',
    'Om tröjan tittar uppfordrande på dig kanske du behåller den längre. Det hoppas textilkonstnären Ýr Jóhannsdóttir.',
    'Maria Diedrichs'
  ),
];

app.get('/posts', (_: Request, res: Response) => {
  res.json(posts);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
