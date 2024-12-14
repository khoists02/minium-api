import express from "express";
import routes from "@src/routes/index";
import { initDb } from "@src/database/index";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

// Initialize the database
initDb();

export default app;