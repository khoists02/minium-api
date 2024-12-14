# Node.js TypeScript Express Project with Sequelize and PostgreSQL

This project is a **Node.js** application built with **TypeScript**, using **Express** as the web framework, **Sequelize** for ORM, and **PostgreSQL** as the database. The project is configured with Docker for easy setup and environment management.

## Table of Contents
- [Project Setup](#project-setup)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [Folder Structure](#folder-structure)
- [Docker Setup](#docker-setup)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Project Setup

This project uses the following technologies:
- **Node.js** with **TypeScript**
- **Express** for handling HTTP requests
- **Sequelize ORM** for database interaction with **PostgreSQL**
- **Docker** for containerization
- **Prettier** and **ESLint** for code style enforcement

---

## Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **Docker** and **Docker Compose** (for containerized development)
- **TypeScript** (if not globally installed, it's set up locally)

### Steps to Set Up Locally

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/express-ts-sequelize-postgres.git
    cd express-ts-sequelize-postgres
    ```

2. **Install dependencies:**

    Use **npm** or **yarn** to install the required dependencies.

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Install Docker (Optional but recommended for development):**

    To use Docker, ensure it's running locally on your system. You'll be using Docker to run PostgreSQL and isolate the environment for easy setup.

    ```bash
    docker-compose up --build
    ```

---

## Running the Application

1. **Start the app with TypeScript:**

    After installing dependencies, you can run the application in development mode using:

    ```bash
    npm run dev
    ```

    This will start the server using `ts-node-dev` and `tsconfig-paths` to allow automatic reloading and path resolution for TypeScript aliases (`@src`).

2. **Alternatively, build and run the app in production:**

    To compile the TypeScript code and run it:

    ```bash
    npm run build    # Compile TypeScript to JavaScript
    npm run start    # Start the application
    ```

---

## Configuration

### TypeScript Aliases

This project uses path aliases to simplify import statements. For example:

```typescript
import { User } from '@src/models/User.model';