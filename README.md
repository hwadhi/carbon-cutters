# Carbon Cutters

Carbon Cutters is a modern ESG operations portal for manufacturing teams. It brings machine telemetry, logistics emissions, evidence management, audit controls, and AI-assisted reporting into one focused workspace.

Built with a sample client profile for **Apex Precision Manufacturing Pvt. Ltd.**, the application demonstrates a clean, light-themed experience for carbon accounting and operational compliance.

## Highlights

- Track Scope 1, 2, and 3 emissions across production assets and freight operations
- Review certified ESG ledger balances and compliance checkpoints
- Manage telemetry logs, document evidence, approvals, and audit-ready records
- Explore emissions insights through interactive analytics
- Generate carbon disclosures and use the integrated compliance advisor
- Filter operational data by machine, shift, job, and reporting period

## Technology

- React 19 and TypeScript
- Vite and Tailwind CSS
- Express server
- Recharts and Lucide icons

## Getting started

### Prerequisites

- Node.js 20 or later

### Install and run

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open the local address shown in the terminal. To enable AI-backed features, add a valid `GEMINI_API_KEY` to `.env.local`.

## Production build

```bash
npm run build
npm run start
```

## Project structure

```text
src/          React application and UI components
server.ts     Express API and AI integration
assets/       Static assets
```

## Security

Do not commit `.env.local` or API keys. The included `.env.example` documents the expected environment configuration.

## License

This project is currently published without a license. Add an appropriate license before reuse or distribution.
