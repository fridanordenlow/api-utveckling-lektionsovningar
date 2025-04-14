// En klass är som en mall (av ett objekt), utifrån mallen kan vi skapa flera "objekt-instanser"
export class Todo {
  id: number = 0; // Initialt värde behövs
  content: string = '';
  done: boolean = false;
  date: string = '';
  // constructor är en självkörande funktion
  // (inom parentes) data som kommer utifrån
  constructor(content: string) {
    this.id = Math.round(Math.random() * 1000); // this refererar till sin class
    this.content = content;
    this.done = false;
    this.date = new Date().toDateString();
  }
}
