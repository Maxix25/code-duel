# Code Duel

<img src="https://skillicons.dev/icons?i=typescript,vite,vitest,jest,react,materialui,express,mongodb,pnpm" />

Code Duel is a TypeScript-based project designed to provide a competitive coding experience, where users can challenge each other to solve programming problems in real time. This repository is written primarily in TypeScript and aims to deliver an interactive and engaging coding platform.

## Features

- Real-time coding challenges between users
- Problem library for a variety of programming tasks
- Live code editor with syntax highlighting
- Google OAuth

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [pnpm](https://pnpm.io/) (recommended)

### Installation

Clone the repository:

```bash
git clone https://github.com/Maxix25/code-duel.git
cd code-duel
```

---

## Running the App

### Frontend

1. Navigate to the frontend directory using `cd frontend`.
2. Install frontend dependencies (if not already done globally):
    ```bash
    pnpm install
    ```
3. Setup the .env file with this variables:
   ```env
   VITE_BACKEND_URL=http://localhost:3000 # The env variable has to start with VITE_
   ```
4. Start the frontend development server:
    ```bash
    pnpm dev
    ```
5. The frontend should now be running, and will be available at [http://localhost:5173](http://localhost:5173).

### Backend

1. Open a new terminal window.
2. Navigate to the backend directory (e.g., `cd backend`).
3. Install backend dependencies (if not already done globally):
    ```bash
    pnpm install
    ```
4. Setup the .env file with this variables:
   ```env
   JUDGE0_API_KEY=your-api-key
   JWT_SECRET=your-jwt-secret
   BE_BASE_URL=http://localhost:3000 # Change this if you need
   FE_BASE_URL=http://localhost:5173 # Change this if you need
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   MONGODB_URI=mongodb://your-mongo-uri
   ```
   You can get a judge0 api key using [rapidapi](https://rapidapi.com/judge0-official/api/judge0-ce)
5. Start the backend server:
    ```bash
    pnpm dev
    ```
6. The backend should now be running on [http://localhost:3000](http://localhost:3000).

---

### Build for Production

#### Frontend

```bash
cd frontend
pnpm build
```

#### Backend

```bash
cd backend
pnpm build
```
