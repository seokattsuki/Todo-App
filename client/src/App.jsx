import EditTodoForm from "./components/EditTodoForm";
import {
  getallTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from "./api/todoApi.jsx"
import AddTodoForm from "./components/AddTodoForm.jsx"
import { useState, useEffect } from "react";


//get all todo
function App() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
  const fetchTodos = async () => {
    try {
      const response = await getallTodos();
      console.log('Fetched todos:', response.data); // Debug line
      // Ensure we always set an array
      setTodos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(`Error fetching todos: ${error}`);
      // Set empty array on error
      setTodos([]);
    }
  }
  fetchTodos();
}, []);


  // create todo
  // In your handleAddTodo function, change this:
const handleAddTodo = async (newTodo) => {
  try {
    const response = await createTodo(newTodo);
    setTodos((prev) => {
      const currentTodos = Array.isArray(prev) ? prev : [];
      const newTodoData = response.data.Todo; // Use capital T
      return [...currentTodos, newTodoData];
    });
  } catch (error) {
    console.error(`Error adding todo: ${error}`);
  }
};

  //delete todo
  const handleDeleteTodo = async (id) => {
  try {
    await deleteTodo(id);
    setTodos((prev) => {
      const currentTodos = Array.isArray(prev) ? prev : [];
      return currentTodos.filter((todo) => todo._id !== id);
    });
  } catch (error) {
    console.error(`Error deleting todo: ${error}`);
  }
}

  // Toggle complete
  const handleToggleComplete = async (id, currentStatus) => {
  try {
    const response = await updateTodo(id, { isCompleted: !currentStatus});
    setTodos((prev) => {
      const currentTodos = Array.isArray(prev) ? prev : [];
      return currentTodos.map((todo) => 
        todo._id === id ? { ...todo, isCompleted: response.data.isCompleted } : todo
      );
    });
  } catch (error) {
    console.error(`Error toggling todo completion: ${error}`);
  }
}

  // update a todo
  const handleUpdateTodo = async (id, updatedData) => {
    try {
      const response = await updateTodo(id, updatedData);
      setTodos((prev) => prev.map((todo) => (todo._id == id ? response.data : todo))
    );
    } catch (error) {
      console.error(`Error updating todo: ${error}`)
    }
  }



  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Todo List</h1>

      {/* Add Todo Form */}
      <AddTodoForm onTodoAdded={handleAddTodo} />

      {/* Todo List */}
      <ul className="mt-6 w-full max-w-md space-y-3">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo._id}
              className="flex flex-col bg-white p-4 rounded-xl shadow"
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-lg font-medium ${
                    todo.isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleComplete(todo._id, todo.isCompleted)}
                    className="px-3 py-1 rounded-lg text-sm bg-green-500 text-white hover:bg-green-600"
                  >
                    {todo.isCompleted ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => setEditingTodo(todo)}
                    className="px-3 py-1 rounded-lg text-sm bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="px-3 py-1 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Description */}
              {todo.description && (
                <p className="text-gray-600 text-sm mt-2">{todo.description}</p>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-600 text-center">No todos available</p>
        )}
      </ul>

      {/* Edit Form Modal */}
      {editingTodo && (
        <EditTodoForm
          todo={editingTodo}
          onUpdate={handleUpdateTodo}
          onCancel={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}

export default App;