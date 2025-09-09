import { useState } from "react";

const AddTodoForm = ({ onTodoAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onTodoAdded({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(`Error adding todo: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm"
    >
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          />
        </div>
        
        <div className="relative">
          <textarea
            placeholder="Add some details... (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <span>Add Task</span>
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;