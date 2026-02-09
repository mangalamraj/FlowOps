# FlowOps
Present your orders smartly.

FlowOps is a TypeScript-first project that helps present and manage orders with a clean Next.js frontend and a TypeScript + Express backend. The repository is structured into two main parts:

- `frontend/` — the Next.js client application (TypeScript) using Tailwind CSS and shadcn/ui
- `server/` — the API/backend (Node + Express + TypeScript)

This README provides an overview, quick start instructions, development workflow, and guidance for contributors.

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install dependencies](#install-dependencies)
  - [Local development](#local-development)
  - [Building for production](#building-for-production)
- [Environment variables](#environment-variables)
---

## About

FlowOps aims to "present your orders smartly" by providing a responsive and user-friendly client to view and manage orders with a TypeScript backend powering the API and business logic.

---

## Features

- Next.js frontend with TypeScript
- Tailwind CSS for utility-first styling
- shadcn/ui components for a consistent design system
- Express + Node.js backend written in TypeScript
- Clear separation of client and server code


---

## Tech stack

- Frontend: Next.js (TypeScript), Tailwind CSS, shadcn/ui
- Backend: Node.js, Express, TypeScript
- Package manager: pnpm (workspaces)
- Styling: Tailwind CSS

---

## Repository structure

- `frontend/` — Next.js application (TypeScript). UI, routing, API client, styles.
- `server/` — Express API (TypeScript). Endpoints, business logic, DB access.
- `README.md` — this file

---

## Getting started

### Prerequisites

- Node.js v16+ (or the version your project targets)
- pnpm (install from https://pnpm.io)

### Install dependencies

This repository uses pnpm workspaces. From the repository root run:

```bash
pnpm install
# or shorthand
pnpm i
```

Running `pnpm install` at the repo root will install dependencies for all workspace packages (frontend and server).

### Local development

Start the frontend (Next.js):

```bash
# from repo root
cd frontend
pnpm run dev
```

Start the backend (Express):

```bash
cd server
pnpm run develop
```

Notes:
- Next.js standard dev script is `dev` (Next runs on port 3000 by default unless overridden).
- The server dev script  is  `develop`. If you prefer, you can also run both in parallel using a tool like `concurrently` or via pnpm filters:
  - pnpm --filter frontend dev
  - pnpm --filter server dev


### Building for production

Build the frontend:

```bash
cd frontend
pnpm run build
```

Build the server (if compiled to JS):

```bash
cd server
pnpm run build
```

Deployment often involves building the frontend and serving its output from a static host (or from the server) and deploying the server to your chosen hosting provider.

---

## Environment variables

Frontend environment variables:
- NEXT_PUBLIC_BACKEND_URL — the base URL of the running backend API (e.g. `http://localhost:8000`)

Backend environment variables (create `server/.env` or set in your environment):

- PORT=
- OPENAI_API_KEY=
- DECRYPTION_SECRET=
- PG_DATABASE=
- PG_USER=
- PG_PASSWORD=
- PG_HOST=
- PG_PORT=


