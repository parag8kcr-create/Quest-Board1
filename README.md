# Neural Protocol - Momentum App

A gamified productivity dashboard built with React, Tailwind CSS, and local storage.

## Setup Instructions for VS Code (Local Development)

To run this application locally in VS Code, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (LTS recommended)

### 2. Environment Configuration
1. Clone or download the source code.
2. Create a `.env` file in the root directory.
3. Copy the variables from `.env.example` into your new `.env` file.

### 3. Install and Run
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will typically be available at `http://localhost:3000`.

## Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs TypeScript type checking.

## Architecture

This application uses:
- **Vite**: Build tool and dev server.
- **Local Storage**: Data persistence for quests, events, and rewards.
- **Motion (motion/react)**: High-performance animations.
- **Tailwind CSS**: Utility-first styling with a custom cyberpunk theme.
