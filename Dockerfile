# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

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
