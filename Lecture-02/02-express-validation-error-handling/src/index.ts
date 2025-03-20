import express, { Request, Response } from 'express';
import { Todo } from './models/Todo';
import { Post } from './models/Post';

const app = express();

app.use(express.json()); // Middleware för att tolka JSON

// Vi använder try /catch för att efterlikna vad som händer när man jobbar med en extern tjänst/server för
// if-satser kan vi bara använda lokalt, men i slutändan vill vi jobba med en databas
// man använder med try/catch när man jobbar med externa tjänste (såsom en databas)
// testa (try) att göra ett anrop till servern, om det blir fel därifrån signaler den och vi snappar upp det (catch)

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

  try {
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
  } catch (error: unknown) {
    // Snappar upp fel från den externa tjänsten
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// - Build on the previous code, add error handling with try/catch on all your endpoints
// - Return data with correct HTTP status codes
//   - 200 - OK
//   - 201 - Created
//   - 400 - Bad Request
//   - 404 - Not Found
//   - 500 - Internal Server Error

// Path params
app.get('/posts/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const post = posts.find((p) => p.id === parseInt(id));

  try {
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to retrieve post: ${message}` });
  }

  res.json({ post });
});

// Create post (anropstyp POST)
app.post('/posts', (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  try {
    if (!title || !content || !author) {
      res
        .status(400)
        .json({ error: 'Title, content, and author are required' });
      return;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }

  const newPost = new Post(title, content, author);
  posts.push(newPost);
  res.status(201).json({ message: 'New post added', data: newPost });
});

// Update with PATCH
app.patch('/posts/:id', (req: Request, res: Response) => {
  const title = req.body.title;
  const post = posts.find((p) => p.id === parseInt(req.params.id));

  try {
    if (title === undefined) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    post.title = title;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }

  res.json({ message: 'Title updated', newTitle: title });
});

// Delete post with DELETE
app.delete('/posts/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const postIndex = posts.findIndex((p) => p.id === parseInt(id));

  try {
    if (postIndex === -1) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }

  posts.splice(postIndex, 1);
  res.json({ message: 'Post deleted' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
