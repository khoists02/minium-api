import express, { NextFunction } from "express";
import userRoutes from "@src/routes/user.router";
import corsConfig from "@src/config/cors";
import appConfig from "@src/config/app";
import { initDb } from "@src/database/index";
import { Request, Response, ErrorRequestHandler } from "express";
const app = express();

console.log("Application allow origins :", appConfig.allowOrigins?.split(","))



// CORS middleware
app.use(corsConfig);

// Middleware
app.use(express.json());

// Init Routes
app.use("/api", userRoutes);

// Middleware: Handle Not Found Routes
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
  });

// Middleware: Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
  
    // General error response
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Something went wrong',
    });
  });
  

// Initialize the database
initDb();

export default app;