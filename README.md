<div align="center">

# 🌱 Carbon Cutters

**A modern ESG operations portal for manufacturing enterprises**

Unify machine telemetry, logistics emissions, evidence management, audit controls, and AI-assisted reporting into a single, focused workspace.

[![Node](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-Unlicensed-lightgrey.svg)](#license)

</div>

---

## Overview

**Carbon Cutters** is a full-stack ESG (Environmental, Social, and Governance) operations platform purpose-built for manufacturing organizations. It consolidates the operational data that carbon accounting depends on — shop-floor machine telemetry, freight and logistics emissions, compliance evidence, and audit trails — into one system of record, then layers AI-assisted analysis on top to help sustainability and operations teams move from raw data to audit-ready disclosures faster.

The platform is designed to scale from a single production facility to a multi-site manufacturing group, with role-based access, configurable reporting periods, and an extensible data model that adapts to different machine fleets, shift patterns, and emission scopes.

## Why Carbon Cutters

Manufacturers are increasingly required to report Scope 1, 2, and 3 emissions to customers, regulators, and investors — but the underlying data is usually scattered across SCADA systems, spreadsheets, logistics providers, and paper-based audit trails. Carbon Cutters exists to close that gap by giving operations and sustainability teams a shared, real-time view of emissions data without needing to stitch together disconnected tools.

## Key Features

| Area | Capability |
|---|---|
| **Emissions Tracking** | Track Scope 1, 2, and 3 emissions across production assets and freight/logistics operations |
| **ESG Ledger** | Maintain a certified ESG ledger with running balances and compliance checkpoints |
| **Telemetry & Evidence** | Log machine telemetry, attach document evidence, and manage approval workflows |
| **Audit Readiness** | Keep audit-ready records with full traceability for internal and third-party review |
| **Analytics** | Explore emissions trends and hotspots through interactive, chart-driven dashboards |
| **AI-Assisted Reporting** | Generate carbon disclosure drafts and query an integrated compliance advisor powered by Google Gemini |
| **Operational Filtering** | Slice data by machine, shift, job, and reporting period for granular analysis |
| **Role-Based Access** | Dedicated login portal to segment access across operations, sustainability, and audit roles |

## Architecture

Carbon Cutters is a full-stack TypeScript application: a React single-page application for the operator/analyst experience, and an Express server that handles API routing and integration with the Gemini AI API.

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   React 19 + TypeScript │  HTTP  │      Express Server       │
│   (Vite, Tailwind CSS)  │◄──────►│  (server.ts, API routes)  │
│   Recharts · Lucide     │        │   Google Gemini API       │
└─────────────────────────┘        └──────────────────────────┘
```

## Tech Stack

**Frontend**
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 6](https://vitejs.dev) for tooling and dev server
- [Tailwind CSS 4](https://tailwindcss.com) for styling
- [Recharts](https://recharts.org) for data visualization
- [Lucide](https://lucide.dev) for iconography
- [Motion](https://motion.dev) for animation

**Backend**
- [Express](https://expressjs.com) API server (`server.ts`)
- [Google Gemini API](https://ai.google.dev) (`@google/genai`) for AI-assisted reporting

**Tooling**
- `tsx` for local development, `esbuild` for server bundling
- `tsc --noEmit` for type checking

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20 or later
- A Google Gemini API key (only required for AI-assisted features)

### Installation

```bash
git clone https://github.com/hwadhi/carbon-cutters.git
cd carbon-cutters
npm install
```

### Configuration

Copy the example environment file and populate it with your own values:

```bash
# macOS/Linux
cp .env.example .env.local

# Windows
copy .env.example .env.local
```

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Required to enable AI-assisted disclosure generation and the compliance advisor |
| `APP_URL` | The base URL the app is served from (used for self-referential links) |

### Run in development

```bash
npm run dev
```

Open the local address printed in the terminal to view the app.

### Type checking

```bash
npm run lint
```

## Production Build

```bash
npm run build
npm run start
```

`npm run build` compiles the client bundle with Vite and bundles the Express server with esbuild into `dist/`. `npm run start` serves the production build.

## Project Structure

```text
carbon-cutters/
├── server.ts                 # Express API server + Gemini AI integration
├── index.html                # App entry HTML
├── metadata.json             # Application metadata
├── src/
│   ├── main.tsx               # React application entry point
│   ├── App.tsx                 # Root application component and routing
│   ├── types.ts                 # Shared TypeScript types
│   ├── presets.ts               # Default configuration / sample presets
│   ├── mockDb.ts                # Sample/mock data layer for local development
│   ├── index.css                # Global styles (Tailwind)
│   ├── assets/                  # Static assets (images, etc.)
│   └── components/
│       ├── Header.tsx             # App header
│       ├── Sidebar.tsx            # Primary navigation
│       ├── LoginPortal.tsx        # Authentication / login screen
│       ├── FiltersBar.tsx         # Machine / shift / job / period filters
│       ├── MachinesView.tsx       # Machine telemetry and asset view
│       ├── LogisticsView.tsx      # Freight and logistics emissions view
│       ├── EsgLedgerView.tsx      # ESG ledger and compliance checkpoints
│       ├── AnalyticsView.tsx      # Interactive emissions analytics
│       ├── DocumentLibrary.tsx    # Evidence and document management
│       ├── ReportsView.tsx        # Disclosure and report generation
│       ├── AiChatbot.tsx          # AI-assisted compliance advisor
│       └── FeedbackView.tsx       # User feedback capture
└── .env.example               # Environment variable template
```

## Data Model

Carbon Cutters ships with a sample dataset (`src/mockDb.ts`, `src/presets.ts`) that models a representative manufacturing operation — production machines, shifts, freight jobs, and emissions records — so the platform is fully explorable out of the box. In a production deployment, this layer is intended to be replaced with connections to your organization's own telemetry, ERP, and logistics data sources.

## Roadmap

- [ ] Pluggable data connectors for SCADA/IoT telemetry and ERP systems
- [ ] Multi-site and multi-tenant support
- [ ] Exportable disclosure reports aligned to common ESG frameworks (e.g., GHG Protocol, BRSR, CDP)
- [ ] Persistent database backend (replacing the in-memory sample data layer)
- [ ] Automated test coverage

## Security

- Never commit `.env.local` or any file containing live API keys or credentials.
- `.env.example` documents the required environment variables without exposing secrets.
- Review and rotate the `GEMINI_API_KEY` regularly, and scope it to the minimum required permissions.
- Report security concerns privately rather than via public issues.

## Contributing

Contributions are welcome. If you'd like to propose a change:

1. Fork the repository and create a feature branch.
2. Make your changes, keeping components focused and typed.
3. Run `npm run lint` to confirm the project still type-checks.
4. Open a pull request describing the change and its motivation.

## License

This project is currently published without a license. Until a license is added, all rights are reserved by the author and the code should not be reused or redistributed without permission. See the repository owner for licensing inquiries.

## Acknowledgements

Built with React, Vite, Tailwind CSS, Express, and the Google Gemini API.
