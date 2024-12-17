import cors from "cors";
import appConfig from "./app";

const allowOrigins = appConfig.allowOrigins?.split(",") || ["http://localhost:3000"]

const corsOptions: cors.CorsOptions = {
  origin: allowOrigins, // Add allowed origins here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies or authentication headers
  exposedHeaders: ['X-Total-Count'], // Headers to expose
  optionsSuccessStatus: 204 // Status for preflight OPTIONS requests
};

export default cors(corsOptions);