import express from "express";
import {getAllTodos, getSingleTodo, createTodo, updateTodo, deleteTodo, markAsCompleted} from "../controllers/todo.controllers.js";


const router = express.Router();

// get all todos
router.get("/", getAllTodos);

// get single todo by Id
router.get("/:id", getSingleTodo);

// create a new todo
router.post("/", createTodo);

// update a todo
router.put("/:id", updateTodo);

// delete a todo
router.delete("/:id", deleteTodo);

// mar a todo as completed
router.patch("/:id/complete", markAsCompleted);

export default router;

