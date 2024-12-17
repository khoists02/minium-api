/**
 * Config env
 */
import dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    allowOrigins: process.env.ALLOW_ORIGINS,
}

export default config;
