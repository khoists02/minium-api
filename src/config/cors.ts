import cors from "cors";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins, // Add allowed origins here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies or authentication headers
};

export default cors(corsOptions);