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
      await updateTodo(id, { isCompleted: !currentStatus });
      setTodos((prev) => {
        const currentTodos = Array.isArray(prev) ? prev : [];
        return currentTodos.map((todo) => 
          todo._id === id ? { ...todo, isCompleted: !currentStatus } : todo
        );
      });
    } catch (error) {
      console.error(`Error toggling todo completion: ${error}`);
    }
  }

  const handleUpdateTodo = async (id, updatedData) => {
    try {
      const response = await updateTodo(id, updatedData);
      setTodos((prev) => prev.map((todo) => 
        todo._id === id ? { ...todo, ...updatedData } : todo
      ));
      setEditingTodo(null);
    } catch (error) {
      console.error(`Error updating todo: ${error}`)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Todo List
          </h1>
          <p className="text-gray-600">
            Organize your tasks efficiently
          </p>
        </div>

        {/* Add Todo Form */}
        <div className="mb-8">
          <AddTodoForm onTodoAdded={handleAddTodo} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{todos.length}</div>
            <div className="text-gray-600 text-sm">Total Tasks</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{todos.filter(t => t.isCompleted).length}</div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{todos.filter(t => !t.isCompleted).length}</div>
            <div className="text-gray-600 text-sm">Remaining</div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length > 0 ? (
            <div className="grid gap-4">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="group bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={todo.isCompleted || false}
                          onChange={() => handleToggleComplete(todo._id, todo.isCompleted)}
                          className="mt-1 mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-500 bg-white border-gray-300"
                        />
                        <div className="flex-1">
                          <h3 className={`text-lg font-medium transition-all duration-200 ${
                            todo.isCompleted 
                              ? "line-through text-gray-400" 
                              : "text-gray-900"
                          }`}>
                            {todo.title || "Untitled Task"}
                          </h3>
                          {todo.description && (
                            <p className={`text-sm mt-2 transition-all duration-200 ${
                              todo.isCompleted 
                                ? "line-through text-gray-400" 
                                : "text-gray-600"
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
                        className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200 border border-gray-300"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="px-3 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 transition-colors duration-200 border border-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="text-4xl text-gray-300 mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No tasks yet</h3>
              <p className="text-gray-400">Add your first task to get started</p>
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