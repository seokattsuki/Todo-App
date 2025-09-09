import EditTodoForm from "./components/EditTodoForm";
import {
  getallTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from "./api/todoApi.jsx"
import AddTodoForm from "./components/AddTodoForm.jsx"
import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getallTodos();
        setTodos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(`Error fetching todos: ${error}`);
        setTodos([]);
      }
    }
    fetchTodos();
  }, []);

  const handleAddTodo = async (newTodo) => {
    try {
      const response = await createTodo(newTodo);
      setTodos((prev) => {
        const currentTodos = Array.isArray(prev) ? prev : [];
        const newTodoData = response.data.Todo;
        return [...currentTodos, newTodoData];
      });
    } catch (error) {
      console.error(`Error adding todo: ${error}`);
    }
  };

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

  const handleUpdateTodo = async (id, updatedData) => {
    try {
      const response = await updateTodo(id, updatedData);
      setTodos((prev) => prev.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.error(`Error updating todo: ${error}`)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            My Todo List
          </h1>
          <p className="text-gray-400">
            Organize your tasks efficiently
          </p>
        </div>

        {/* Add Todo Form */}
        <div className="mb-8">
          <AddTodoForm onTodoAdded={handleAddTodo} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{todos.length}</div>
            <div className="text-gray-400 text-sm">Total Tasks</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{todos.filter(t => t.isCompleted).length}</div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{todos.filter(t => !t.isCompleted).length}</div>
            <div className="text-gray-400 text-sm">Remaining</div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length > 0 ? (
            <div className="grid gap-4">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="group bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={todo.isCompleted || false}
                          onChange={() => handleToggleComplete(todo._id, todo.isCompleted)}
                          className="mt-1 mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                        />
                        <div className="flex-1">
                          <h3 className={`text-lg font-medium transition-all duration-200 ${
                            todo.isCompleted 
                              ? "line-through text-gray-500" 
                              : "text-white"
                          }`}>
                            {todo.title || "Untitled Task"}
                          </h3>
                          {todo.description && (
                            <p className={`text-sm mt-2 transition-all duration-200 ${
                              todo.isCompleted 
                                ? "line-through text-gray-500" 
                                : "text-gray-400"
                            }`}>
                              {todo.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                      <button
                        onClick={() => setEditingTodo(todo)}
                        className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="px-3 py-2 rounded-md text-sm font-medium bg-red-900/30 text-red-400 hover:bg-red-800/40 hover:text-red-300 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-4xl text-gray-600 mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No tasks yet</h3>
              <p className="text-gray-500">Add your first task to get started</p>
            </div>
          )}
        </div>

        {/* Edit Form Modal */}
        {editingTodo && (
          <EditTodoForm
            todo={editingTodo}
            onUpdate={handleUpdateTodo}
            onCancel={() => setEditingTodo(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;