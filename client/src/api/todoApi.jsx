import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api/todos",
})

export const getallTodos = async () => apiClient.get("/");
export const createTodo = async (todo) => apiClient.post("/", todo);
export const updateTodo = async (id, updateData) => apiClient.put(`/${id}`, updateData);
export const deleteTodo = async (id) => apiClient.delete(`/${id}`);


