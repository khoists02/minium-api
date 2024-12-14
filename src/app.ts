import express from "express";
import routes from "@src/routes/index";
import corsConfig from "@src/config/cors";
import { initDb } from "@src/database/index";

const app = express();

// CORS middleware
app.use(corsConfig)

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

// Initialize the database
initDb();

export default app;