# Runable Companion — FastAPI AI Backend

FastAPI backend connecting the **Runable Companion** browser extension to **AgentRouter**'s `gpt-6.1-sol` model via OpenAI-compatible API.

---

## 1. Prerequisites
- **Python 3.11+** installed (`python --version`)
- AgentRouter API key from [agentrouter.org](https://agentrouter.org/)

---

## 2. Setup (Windows PowerShell)

Open PowerShell and run:

```powershell
# Navigate to backend directory
cd "C:\Users\USER\OneDrive\Desktop\Runable Companion\runable-companion\backend"

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Copy example environment configuration
Copy-Item .env.example .env
```

---

## 3. Configure Your AgentRouter API Key

Open `backend\.env` in your text editor and set your API key:

```env
AGENT_ROUTER_API_KEY=your_actual_key_here
AGENT_ROUTER_BASE_URL=https://co.agentrouter.org/v1
AGENT_ROUTER_MODEL=openai/gpt-6.1-sol
```

> **Security Note:** Never commit `backend/.env` or paste your API key into git. The backend handles all AI requests so that your API key is never exposed to the frontend or extension bundle.

---

## 4. Run the Backend Server

With the virtual environment activated:

```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The server will be available at:
- **Base URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Interactive OpenAPI Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 5. Frontend Development & Extension Build

In a separate terminal window at the repository root (`runable-companion`):

```powershell
# Run Vite dev server for browser preview
npm run dev

# Or build the Chrome Extension bundle
npm run build
```

---

## 6. API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check (`{"status":"ok","service":"runable-companion-backend"}`) |
| `GET` | `/api/config` | Safe configuration (model ID and streaming capability; no secrets) |
| `POST` | `/api/chat` | Non-streaming chat completion with recent message history and optional page context |
| `POST` | `/api/chat/stream` | Progressive Server-Sent Events (SSE) streaming chat completion (`event: token`, `done`, `error`) |
| `POST` | `/api/summarize` | Summarize active webpage (overview, takeaways, and source URL) |
| `POST` | `/api/summarize/stream` | Progressive streaming page summarizer via SSE |

---

## 7. Token-Saving Architecture

To minimize token usage and credit consumption:
- **Short History Window:** Only the latest **6 messages** (configurable via `CHAT_HISTORY_LIMIT`) are sent to the model.
- **Deduplication:** Repeated identical user/assistant message pairs are pruned automatically.
- **Context Truncation:** Extracted webpage text is cleaned and capped to **8,000 characters** (configurable via `MAX_PAGE_CONTEXT_CHARS`).
- **Targeted Context Injection:** Full webpage text is only sent when user explicitly clicks **Summarize this page**. For **Ask with Runable**, only the highlighted text and source URL are provided.
- **Follow-up Optimization:** Follow-up questions do not re-send the full page text.
- **Output Budget:** Capped via `CHAT_MAX_OUTPUT_TOKENS=500` and `SUMMARY_MAX_OUTPUT_TOKENS=700`.

---

## 8. Troubleshooting

- **503 AI backend not configured:** Ensure `AGENT_ROUTER_API_KEY` in `backend/.env` is set to your actual key.
- **401 Authentication failed:** Verify your AgentRouter key on your [agentrouter.org](https://agentrouter.org/) dashboard.
- **429 Rate limit reached:** AgentRouter rate limits reached. Wait a few seconds before retrying.
- **Model not found / unavailable:** Confirm that `openai/gpt-6.1-sol` is available in your account. You can also adjust `AGENT_ROUTER_MODEL` in `.env`.
- **CORS error:** The backend allows `http://localhost:5173` and `chrome-extension://*` by default. Additional origins can be added to `CORS_ORIGINS` in `.env`.
- **Backend not running:** If the backend is offline, Runable Companion automatically falls back to offline demo mode so the UI remains responsive.

