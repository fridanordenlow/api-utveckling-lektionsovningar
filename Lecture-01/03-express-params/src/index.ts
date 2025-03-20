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
    'Gör sin tröja till en vän',
    'Om tröjan tittar uppfordrande på dig kanske du behåller den längre. Det hoppas textilkonstnären Ýr Jóhannsdóttir.',
    'Maria Diedrichs'
  ),
];

// Query string params
app.get('/posts', (req: Request, res: Response) => {
  const search = req.query.search;
  const sort = req.query.sort;

  let filteredPosts = posts;

  if (search) {
    const authorSearch = search.toString().toLowerCase();

    filteredPosts = filteredPosts.filter((p) =>
      p.author.toLowerCase().includes(authorSearch.toString())
    );
  }

  if (sort && sort === 'asc') {
    // Sorts in alphabetical order
    filteredPosts = filteredPosts.sort((a, b) => {
      const post1 = a.title.toLowerCase();
      const post2 = b.title.toLowerCase();

      if (post1 > post2) return 1; // True
      if (post1 < post2) return -1; // False
      return 0; // Equal
    });
  }

  if (sort && sort === 'desc') {
    filteredPosts = filteredPosts.sort((a, b) => {
      const post1 = a.title.toLowerCase();
      const post2 = b.title.toLowerCase();

      if (post1 < post2) return 1; // True
      if (post1 > post2) return -1; // False
      return 0; // Equal
    });
  }

  res.json(filteredPosts);
});

// Path params
app.get('/posts/:id', (req: Request, res: Response) => {
  const id = req.params.id;

  const post = posts.find((p) => p.id === parseInt(id));

  res.json({ post });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
