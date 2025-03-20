import express, { Request, Response } from 'express';
import { Todo } from './models/Todo';
import { Post } from './models/Post';
const app = express();

// Lägg till denna för att inte behöva ha den i varje request?
// General middleware for all requests
// express.json() omvandlar/parsar JSON-strängen till ett JavaScript-objekt
app.use(express.json()); // Middleware för att tolka JSON

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

const todos: Todo[] = [
  new Todo('Handla mat'),
  new Todo('Städa'),
  new Todo('Diska'),
];

app.get('/todos', (_: Request, res: Response) => {
  res.json(todos);
});

app.post('/todos', express.json(), (req: Request, res: Response) => {
  const content = req.body.content;

  // Validering
  if (content === undefined) {
    res.json({ error: 'Content is required' });
    return;
  }

  // const todoExists = todos.find((t) => t.content === content);
  // if (todoExists) {
  //   res.json({ message: 'Todo already added. Please create another one.' });
  //   return;
  // }

  const newTodo = new Todo(content);
  todos.push(newTodo);

  // res.json(req.params: newTodo);
  // res.json({ newTodo });
  // res.json({ message: 'Success from POST', content: req.body.content });
  res.status(201).json({ message: 'New todo added', data: newTodo });
});

// --------------------------------------------------------------------- //
// --------------------------------------------------------------------- //
// --------------------------------------------------------------------- //

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

// Create post (anropstyp POST)
app.post('/posts', (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  // Validering
  // if (title === undefined) {
  //   res.json({ error: 'Title is required' });
  //   return;
  // }
  // if (content === undefined) {
  //   res.json({ error: 'Content is required' });
  //   return;
  // }
  // if (author === undefined) {
  //   res.json({ error: 'Author is required' });
  //   return;
  // }

  if (!title || !content || !author) {
    res.status(400).json({ error: 'Title, content, and author are required' });
    return;
  }

  const newPost = new Post(title, content, author);
  posts.push(newPost);

  res.status(201).json({ message: 'New post added', data: newPost });
});

// Update with PATCH
app.patch('/posts/:id', (req: Request, res: Response) => {
  const title = req.body.title;

  if (title === undefined) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  post.title = title;
  res.json({ message: 'Title updated', newTitle: title });
});

// Delete post with DELETE
app.delete('/posts/:id', (req: Request, res: Response) => {
  const id = req.params.id;

  const postIndex = posts.findIndex((p) => p.id === parseInt(id));
  if (postIndex === -1) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  posts.splice(postIndex, 1);
  res.json({ message: 'Post deleted' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
