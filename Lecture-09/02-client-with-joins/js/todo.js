// window.location är ett objekt som innehåller information om URL:en i webbläsaren just nu.
// Det är alltså hela adressen som står i webbläsarfältet.

console.log(window.location)
console.log(window.location.search)
let params = new URLSearchParams(window.location.search);
let id = params.get("id"); 
console.log(id)

const todoElement = document.getElementById('todo')
console.log(todoElement);

const fetchTodoById = async (e) => {
  try {
    const response =  await fetch('http://localhost:3000/todos/' + id)
    // console.log(response)
    // if (!response.ok) {
    //   throw new Error('API is down')
    // }
    const todo =  await response.json()
    console.log(todo);
  
    todoElement.innerHTML = `
      <div>
        <p>
          <span class="date"><i>${todo.created_at}</i></span>
          <span>${todo.content}</span>
          <p>
          <span><a href="index.html">Back</a></span>
      </div>`
  } catch (error) {
    todoElement.innerHTML = "Opps something when wrong. Please try again later!"
    console.log(error)
  }
}

fetchTodoById();