import express from "express";
import { Todo } from "../models/todo.models.js";
import { errorHandeling } from "../middlewares/error.js"
const router = express.Router();

// get all todos
const getAllTodos = async (req, res, next) => {
    try {
    const todos = await Todo.find();
    if( todos.length === 0){
        res.status(200)
        .json({message: "No todo found"})
    }

    res.status(200)
    .json({ todos });
    } catch (error) {
        next(error);
    }
}

// Handle "get single todo by ID"
const getSingleTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if(!todo){
            res.status(404)
            .json({message: "Todo not Found"});
        }
        res.status(200)
        .json({ todo });

    } catch (error) {
        next(error)
    }
}

// create a new todo
const createTodo = async (req, res, next) => {
    try {
        const TodoData = req.body;
        if(!TodoData){
           return res.status(400)
             .json({message: "No todo detected"})
        }
        const newTodo = await Todo.create(TodoData);
        return res.status(201)
        .json({message:"New Todo created",Todo:newTodo})
    } catch (error) {
        next(error)
    }
}

// update a Todo
const updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if(!updateData || Object.keys(updateData).length === 0){
            return res.status(400)
            .json({message: "NO update  data provided" });
        }
        
        const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
        if(!updatedTodo){
             return res.status(404)
            .json({message: "Todo not Found"});
        }else{
            return res.status(200)
            .json({message: "Todo updated successffully",Todo:updatedTodo});
        }
    } catch (error) {
        next(error)
    }
}

//delete a todo
const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleteTodo = await Todo.findByIdAndDelete(id);
        if(!deleteTodo){
            return res.status(404)
            .json({message: "Todo not found"})
        }

        return res.status(200)
        .json({message: "Todo deleted successfully",todo:deleteTodo})

    } catch (error) {
        next(error)
    }
}

// mark as completed
const markAsCompleted = async (req, res, next) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findById(id)
        if(!todo){
            return res.status(404)
            .json({message: "todo not found"})
        }

        todo.completed = true;
        await todo.save();

        return res.status(200)
        .json({message: "Marked as completed", todo})
    } catch (error) {
        next(error)
    }
}

