import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import todoRoutes from "./routes/todo.routes.js";
import cors from  "cors"

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json())

const uri = process.env.MONGODB_URI;

connectDB(uri);

app.use("/api/todos", todoRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})