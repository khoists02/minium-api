import express, { NextFunction } from "express";
import corsConfig from "@src/config/cors";
import appConfig from "@src/config/app";
import { initDb } from "@src/database/index";
import helmet from "helmet";
import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import userRoutes from "@src/routes/user.router";
import authRoutes from "@src/routes/auth.router";

const app = express();

console.log("Application allow origins :", appConfig.allowOrigins?.split(","))

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "https:"],
        "script-src": ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Example: disable this for special use cases
}));

// Middleware
app.use(express.json());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// CORS middleware
app.use(corsConfig);

// Init Routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);

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