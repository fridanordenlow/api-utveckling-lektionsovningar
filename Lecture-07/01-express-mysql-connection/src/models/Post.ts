export class Post {
  id: number = 0;
  title: string = '';
  content: string = '';
  author: string = '';
  date: string = '';

  constructor(title: string, content: string, author: string) {
    this.id = Math.round(Math.random() * 1000);
    this.title = title;
    this.author = author;
    this.content = content;
    this.date = new Date().toDateString();
  }
}
