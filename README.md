# SpendSmart – Full-Stack Personal Finance Tracker

Modern React + Vite frontend paired with an Express/MongoDB backend for tracking income/expenses, visualizing trends, and chatting with an AI copilot that understands your monthly data.

## Architecture
- **Frontend (Vite/React, MUI X Charts)**: Dashboard, activity charts (income vs expense line, daily cashflow area, category pie, heatmap), AI assistant tab, transaction management.
- **Backend (Express, MongoDB/Mongoose)**: Income/expense CRUD, balance and transaction summaries, daily cashflow, OpenAI-powered assistant, Google sign-in verification.
- **AI**: `/api/ai/ask` calls OpenAI (model `gpt-4.1-mini`) with the user’s monthly aggregates and returns structured JSON that the UI renders conversationally.
- **Persistence**: MongoDB via Mongoose models for `User`, `Income`, and `Expense`.

## Repo Structure
```
backend/   Express API, MongoDB models, OpenAI + Google auth hooks
frontend/  Vite React SPA with dashboard, charts, and AI chat UI
```

## Prerequisites
- Node.js 18+ (recommended 20+)
- npm
- MongoDB instance (local or hosted)
- OpenAI API key
- Google OAuth Client ID (for Google sign-in flow)

## Environment Variables
Create `.env` files as shown.

### Backend (`backend/.env`)
```
BACKEND_PORT=5000
MONGODB_URI=mongodb://localhost:27017/spendsmart
MONGODB_DB_NAME=spendsmart
OPENAI_API_KEY=your_openai_key

# Google sign-in verification
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_TOKEN_VERIFICATION_URL=https://oauth2.googleapis.com/tokeninfo?id_token=

# Used when issuing/verifying tokens (if/when JWT added in client)
JWT_SECRET=replace_me
```

### Frontend (`frontend/.env`)
```
VITE_BACKEND_URI=http://localhost:5000
```

## Setup & Run
1. **Install dependencies**
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
2. **Configure env** (see above).
3. **Start backend**  
   `cd backend && npm run dev` (uses nodemon) or `npm start`.
4. **Start frontend**  
   `cd frontend && npm run dev` then open the printed local URL.

## Key Features (UI)
- **Dashboard**: Month navigation, balance snapshot, quick add income/expense, recent transactions with top-mounted toast + confirmation modal.
- **Activity**: Income vs Expense line chart, daily cashflow area chart, category pie, spending heatmap.
- **AI Assistant**: Full-height chat with quick prompts; sends monthly context to `/api/ai/ask`.
- **Transactions**: Delete with confirmation; auto refreshes lists and dashboard balances; toast feedback.

## API Overview (selected)
- `GET /api/health` – service check.
- `POST /auth/google` – verify Google ID token.
- `GET /api/balance/monthlyBalance?userId=&month=&year=` – monthly balance summary.
- `GET /api/transactions/monthlyTransactions?userId=&month=&year=` – month’s combined income/expenses.
- `DELETE /api/transactions/deleteTransaction?userId=&transactionId=` – delete by id (income or expense).
- `GET /api/transactions/dailyCashflow?userId=&month=&year=` – per-day income/expense/net.
- `POST /api/ai/ask` – body `{ userId, month, year, prompt }` → structured JSON answer.
- Income/Expense CRUD: see `backend/src/routes/income.js` and `backend/src/routes/expense.js`.

## Data Notes
- Transactions are stored separately as `Income` and `Expense` documents; combined views are computed server-side (`transactionService`).
- Charts consume monthly and daily aggregates (line + area charts use white-styled axes/legend for dark UI).

## Development Tips
- **Lint frontend**: `cd frontend && npm run lint`
- **Hot reload**: Vite dev server with HMR; nodemon for backend.
- If the AI endpoint fails JSON parsing, backend returns a 500 with a note; check backend logs for the raw model output.

## Troubleshooting
- **CORS/auth errors**: Ensure `VITE_BACKEND_URI` matches the running backend and Google client ID is correct.
- **Mongo connection**: Confirm `MONGODB_URI` and `MONGODB_DB_NAME`; backend exits on connection failure.
- **OpenAI errors**: Verify `OPENAI_API_KEY` and network egress; watch backend logs.

Happy building!
