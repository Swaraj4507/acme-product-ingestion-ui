# Acme Product Ingestion UI

A React + Vite + TypeScript application for importing, managing, and reviewing product data. It implements:

- CSV upload with progress tracking up to 500k records
- Task history with filtering/pagination and latest task card
- Full CRUD product management (search, filters, pagination, bulk delete)
- Webhook configuration and testing

## Documentation

Complete product and API documentation:  
<https://docs.google.com/document/d/1TKPrWTCeNwRhLXdnCiwPwbW6rC0E0rvYBDfRlYYKVuc/edit?usp=sharing>

## Tech Stack

- React 19, TypeScript, Vite
- Tailwind CSS + shadcn/ui + Lucide icons
- Axios with centralized typed client
- Sonner for toasts, date-fns for time formatting
- Custom hooks for products, tasks, uploads, and webhooks

## Getting Started

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to point at the backend API (defaults to `http://localhost:8000/api`).

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
