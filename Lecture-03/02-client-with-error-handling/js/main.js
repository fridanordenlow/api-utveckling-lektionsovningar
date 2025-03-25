const postElement = document.getElementById('posts');

document.getElementById('inputState').addEventListener('change', (event) => {
    const sortValue = event.target.value; // asc or desc
    const searchQuery = document.getElementById('search').value; // Keep search term if sorting

    fetchPosts(sortValue, searchQuery);
});

document.getElementById('search').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { 
        event.preventDefault();
        
        const searchQuery = event.target.value;
        const sortValue = document.getElementById('inputState').value; // Keep sorting order if searching

        fetchPosts(sortValue, searchQuery);
    }
});


// Fetch with sorting
const fetchPosts = async (sortValue, searchQuery) => {
    try {
        let url = 'http://localhost:3000/posts';
        let params = new URLSearchParams();

        if (sortValue) {
            params.append('sort', sortValue);
            // url += `?sort=${sortValue}`
        }
        if (searchQuery) {
            params.append('search', searchQuery);
        }
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.length === 0) {
            postElement.innerHTML = '<p>Din sökning gav ingen träff.'
        } else {
            postElement.innerHTML = data.map(post => 
                        `<div>
                            <h1>${post.title}</h1>
                            <p>${post.content}</p>
                            <p>${post.author}</p>
                            <p>Publicerad: ${post.date}</p>
                        </div>`).join('');
            console.log(data)
        }
    
    } catch(error) {
        todoElement.innerHTML = "Sorry, something went wrong. Please try again later!"
        console.log(error)
    }
}

fetchPosts();

// fetch('http://localhost:3000/posts') // Makes the request, returns a Promise 
// .then((response) => {                // First then-block handles the first Promise - checking if the connection with the API is established
//  console.log(response)
//  return response.json()              // Returns a new Promise for parsing JSON string - JSON.parse()
// })
// .then(data => {                        // Second then-block handles the parsing of the JSON string
//     console.log(data)
//     // const todos = document.getElementById('todos');
//     // todos.innerHTML = 'Success!'
//     todoElement.innerHTML = data.map(post => 
//         `<div>
//             <h1>${post.title}</h1>
//             <p>${post.content}</p>
//             <p>${post.author}</p>
//             <p>Publicerad: ${post.date}</p>
//         </div>`).join(''); // Join - gör om till en sträng och ta inte med något emellan ('' = empty string)
// })
// .catch(() => {                       // Catch-block is activated when a Promise is rejected
//     console.error('Something went wrong:', error)
// })

//console.log('This will execute before all other console.logs. That is because Fetch is asynchronous.')

// async function fetchTodos() {} // Hoisting - JS moved this code automatically to the top
// Egil: Det är väl bara det att om deklarerar en arrow-function så måste ju den komma innan den koden som den ska köras i.
// Medans om du kör som en vanlig funktion så kan ju den deklareras efter den koden som ska köras i.


// More popular syntax
// async/await + try/catch
// const fetchPosts = async () => {
//     try {
//         const response = await fetch('http://localhost:3000/posts');
//         // console.log(response)
//         // if (!response.ok) {
//         //     throw new Error('API is down')
//         // }

//         const data = await response.json();
    
//         todoElement.innerHTML = data.map(post => 
//                     `<div>
//                         <h1>${post.title}</h1>
//                         <p>${post.content}</p>
//                         <p>${post.author}</p>
//                         <p>Publicerad: ${post.date}</p>
//                     </div>`).join('');
//         console.log(data)
//     } catch(error) {
//         todoElement.innerHTML = "Sorry, something went wrong. Please try again later!"
//         console.log(error)
//     }
// }

// fetchPosts();
