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
3. Start the frontend development server:
    ```bash
    pnpm dev
    ```
4. The frontend should now be running, and will be available at [http://localhost:5173](http://localhost:5173).

### Backend

1. Open a new terminal window.
2. Navigate to the backend directory (e.g., `cd backend`).
3. Install backend dependencies (if not already done globally):
    ```bash
    pnpm install
    ```
4. Start the backend server:
    ```bash
    pnpm dev
    ```
5. The backend should now be running on [http://localhost:3000](http://localhost:3000).

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
