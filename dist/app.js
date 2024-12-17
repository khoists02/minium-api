"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("@src/config/cors"));
const app_1 = __importDefault(require("@src/config/app"));
const index_1 = require("@src/database/index");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const user_router_1 = __importDefault(require("@src/routes/user.router"));
const auth_router_1 = __importDefault(require("@src/routes/auth.router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authenticatedUser_1 = require("@src/middlewares/authenticatedUser");
const app = (0, express_1.default)();
console.log("Application allow origins :", app_1.default.allowOrigins?.split(","));
app.use((0, helmet_1.default)({
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
app.use(express_1.default.json());
// Apply rate limiting to all requests
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);
// CORS middleware
app.use(cors_1.default);
app.use((0, cookie_parser_1.default)());
app.use("/api", auth_router_1.default);
// Init Routes
// @ts-ignore
app.use("/api", authenticatedUser_1.validateToken, user_router_1.default);
// Middleware: Handle Not Found Routes
app.use((req, res) => {
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
(0, index_1.initDb)();
exports.default = app;
