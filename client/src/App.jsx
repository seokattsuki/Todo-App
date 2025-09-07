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
    </div>
  )
}


export default App