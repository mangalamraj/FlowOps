# FlowOps
Check if the orders delivery is as per the rules using ai. We help you not to go throught the long Walmart pdf(200 pages). Our AI takes out rules for your sku and make you a rule checklist. We have also our Computer vision model checking your label placement on your carton

- `frontend/` — the Next.js client application (TypeScript) using Tailwind CSS and shadcn/ui
- `server/` — the API/backend (Node + Express + TypeScript)
- `pdf-parsing-service/` - parses long walmart pdf into sku specific rules
- `label-detection-service/` - detects the faulty label label placed on your carton so that you fix your shipment asap.

This README provides an overview, quick start instructions, development workflow, and guidance for contributors.

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)

---

## About

Check if the orders delivery is as per the rules using ai. We help you not to go throught the long Walmart pdf(200 pages). Our AI takes out rules for your sku and make you a rule checklist. We have also our Computer vision model checking your label placement on your carton

---

## Features

- Next.js frontend with TypeScript
- Tailwind CSS for utility-first styling
- shadcn/ui components for a consistent design system
- Express + Node.js server aggregator written in TypeScript
- Python + openai gpt-4omini + pymupdf for rules parsing
- python + yolov8 for label detection


---

## Tech stack

- Frontend: Next.js (TypeScript), Tailwind CSS, shadcn/ui
- Backend: Node.js, Express, TypeScript, python, yolov8, pymupdf, openai gpt4omini
- Package manager: pnpm (workspaces)
- Styling: Tailwind CSS

---

## Repository structure

- `frontend/` — Next.js application (TypeScript). UI, routing, API client, styles.
- `server/` — Aggregator service containing endpoints for label detection service and pdf parsing service.
- `pdf-parsing-service/` - parses long walmart pdf into sku specific rules
- `label-detection-service/` - detects the faulty label label placed on your carton so that you fix your shipment asap.
- `README.md` — this file

---

