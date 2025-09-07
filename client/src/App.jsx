import { useState, useEffect } from "react";
function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getallTodos();
        setTodos(response.data);
      } catch (error) {
        console.error(`Error fetching todos: ${error}`);
      }
    }
    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Todo List</h1>
        <ul>
          {todos.length > 0 ? (todos.map((todo) => (
            <li key={todo._id}>
              <span style={{textDecoration: todo.isCompleted ? 'line-through' : 'none'}}>
                {todo.title}
              </span>

              // add update and delete buttons
            </li>
          ))
        ) :(
          <p>No todos available</p>
        )}
        </ul>
    </div>
  )
}


export default App;