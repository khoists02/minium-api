# Use a lightweight Node.js base image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./

# Copy the types folder into the container
COPY /src/types /app/types

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Install nodemon globally
RUN npm install -g nodemon

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
