import express from "express";
import corsConfig from "@src/config/cors";
import appConfig from "@src/config/app";
import { initDb } from "@src/database/index";
import helmet from "helmet";
import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import userRoutes from "@src/routes/user.router";
import authRoutes from "@src/routes/auth.router";
import cookieParser from "cookie-parser";
import { validateToken } from "@src/middlewares/authenticatedUser";


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

// Middlewares
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
app.use(cookieParser());

app.use("/api", authRoutes);

// Init Routes
// @ts-ignore
app.use("/api", validateToken, userRoutes);

// Middleware: Handle Not Found Routes
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
  });

// Middleware: Global Error Handler
// Centralized Error Handling Middleware
// @ts-ignore
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error(`[Error]: ${err.message}`); // Log the error (optional)

//   // Handle specific error types (e.g., validation, DB errors, etc.)
//   if (err.name === 'ValidationError') {
//     return res.status(400).json({ message: err.message });
//   }

//   // Generic server error
//   res.status(500).json({ message: 'Internal Server Error', error: err.message });
// });

  

// Initialize the database
initDb();

export default app;