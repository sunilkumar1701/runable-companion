"""
Runable Companion — FastAPI Backend
Exposes health, configuration, chat, and summarization endpoints.
"""

import json
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import settings
from app.schemas import (
    ChatRequest,
    SummarizeRequest,
    HealthResponse,
    ConfigResponse,
)
from app.services.ai_service import (
    chat_completion,
    chat_completion_stream,
    summarize_page,
    summarize_page_stream,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("runable.main")

app = FastAPI(
    title="Runable Companion Backend",
    version="1.0.0",
    description="FastAPI AI backend for Runable Companion powered by AgentRouter GPT-6.1-Sol",
)

# CORS Middleware
# Allows Vite dev server (http://localhost:5173) and Chrome extension origins (chrome-extension://*)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^chrome-extension://[a-z]{32}$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint. Never exposes sensitive environment details."""
    return HealthResponse(
        status="ok",
        service="runable-companion-backend",
    )


@app.get("/api/config", response_model=ConfigResponse)
async def get_config():
    """Returns safe frontend configuration. Never exposes the API key."""
    return ConfigResponse(
        model=settings.AGENT_ROUTER_MODEL,
        streaming=True,
    )


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Standard non-streaming chat completion.
    Validates recent messages, optional page_context, and mode.
    """
    config_problems = settings.validate()
    if config_problems:
        raise HTTPException(
            status_code=503,
            detail="AI backend not configured. Please set AGENT_ROUTER_API_KEY in backend/.env",
        )

    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        page_context = request.page_context.model_dump() if request.page_context else None

        result = await chat_completion(
            messages=messages,
            page_context=page_context,
            mode=request.mode,
        )
        return result
    except Exception as e:
        logger.error("Chat completion error: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response. Please try again.",
        )


@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Progressive streaming chat completion via Server-Sent Events (SSE).
    Emits event: token, event: done, and event: error.
    """
    config_problems = settings.validate()
    if config_problems:
        raise HTTPException(
            status_code=503,
            detail="AI backend not configured. Please set AGENT_ROUTER_API_KEY in backend/.env",
        )

    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    page_context = request.page_context.model_dump() if request.page_context else None

    async def sse_generator():
        try:
            async for chunk in chat_completion_stream(
                messages=messages,
                page_context=page_context,
                mode=request.mode,
            ):
                event_name = chunk.get("event", "token")
                # Format SSE
                payload = json.dumps(chunk)
                yield f"event: {event_name}\ndata: {payload}\n\n"
        except Exception as e:
            logger.error("Stream SSE generator error: %s", str(e))
            err_payload = json.dumps({"event": "error", "message": "Streaming failed. Please retry."})
            yield f"event: error\ndata: {err_payload}\n\n"

    return StreamingResponse(
        sse_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/api/summarize")
async def summarize(request: SummarizeRequest):
    """
    Summarize a webpage given title, URL, and readable text.
    """
    config_problems = settings.validate()
    if config_problems:
        raise HTTPException(
            status_code=503,
            detail="AI backend not configured. Please set AGENT_ROUTER_API_KEY in backend/.env",
        )

    try:
        result = await summarize_page(
            title=request.title,
            url=request.url,
            text=request.text,
        )
        return result
    except Exception as e:
        logger.error("Summarization error: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to generate page summary. Please try again.",
        )


@app.post("/api/summarize/stream")
async def summarize_stream(request: SummarizeRequest):
    """
    Progressive streaming page summary via SSE.
    """
    config_problems = settings.validate()
    if config_problems:
        raise HTTPException(
            status_code=503,
            detail="AI backend not configured. Please set AGENT_ROUTER_API_KEY in backend/.env",
        )

    async def sse_generator():
        try:
            async for chunk in summarize_page_stream(
                title=request.title,
                url=request.url,
                text=request.text,
            ):
                event_name = chunk.get("event", "token")
                payload = json.dumps(chunk)
                yield f"event: {event_name}\ndata: {payload}\n\n"
        except Exception as e:
            logger.error("Summary stream error: %s", str(e))
            err_payload = json.dumps({"event": "error", "message": "Summary streaming failed. Please retry."})
            yield f"event: error\ndata: {err_payload}\n\n"

    return StreamingResponse(
        sse_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

