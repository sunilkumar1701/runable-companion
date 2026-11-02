"""
AI Service — AgentRouter GPT-6.1-Sol integration via OpenAI Responses API.

Verified protocol for gpt-6.1-sol on AgentRouter:
  Endpoint : https://agentrouter.org/v1/responses
  Method   : POST
  Model    : gpt-6.1-sol
  Headers  : Originator: codex_cli_rs, User-Agent: codex_cli_rs/0.101.0 (Mac OS; arm64), Version: 0.101.0
  Streaming: SSE with events (e.g. response.output_text.delta, response.completed)
"""

import time
import json
import logging
from typing import AsyncGenerator
import httpx

from app.config import settings
from app.prompts.system_prompt import SYSTEM_PROMPT, SUMMARY_PROMPT

logger = logging.getLogger("runable.ai_service")

# AgentRouter required client fingerprint headers
AGENT_ROUTER_HEADERS = {
    "Originator": "codex_cli_rs",
    "User-Agent": "codex_cli_rs/0.101.0 (Mac OS; arm64)",
    "Version": "0.101.0",
}


def _get_headers() -> dict:
    """Construct request headers including authorization and client fingerprint."""
    return {
        "Authorization": f"Bearer {settings.AGENT_ROUTER_API_KEY}",
        "Content-Type": "application/json",
        **AGENT_ROUTER_HEADERS,
    }


def _trim_history(messages: list[dict], limit: int | None = None) -> list[dict]:
    """
    Keep only the latest `limit` messages (user+assistant combined).
    Always preserves the last user message. Removes duplicates.
    """
    limit = limit or settings.CHAT_HISTORY_LIMIT

    seen = set()
    deduped = []
    for m in messages:
        key = (m.get("role"), m.get("content"))
        if key not in seen:
            seen.add(key)
            deduped.append(m)

    if len(deduped) <= limit:
        return deduped
    return deduped[-limit:]


def _truncate_context(text: str, max_chars: int | None = None) -> str:
    """Truncate page context text to the configured character limit."""
    max_chars = max_chars or settings.MAX_PAGE_CONTEXT_CHARS
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n\n[Content truncated for brevity]"


def _build_context_block(page_context: dict | None, mode: str) -> str:
    """Build context text to inject as a system addendum."""
    if not page_context:
        return ""

    parts = []
    if mode == "ask_selection" and page_context.get("selected_text"):
        parts.append(f"Selected text from webpage: \"{page_context['selected_text']}\"")
        if page_context.get("url"):
            parts.append(f"Source URL: {page_context['url']}")
        if page_context.get("title"):
            parts.append(f"Page title: {page_context['title']}")
    elif mode == "page_followup":
        if page_context.get("title"):
            parts.append(f"Page title: {page_context['title']}")
        if page_context.get("url"):
            parts.append(f"Source URL: {page_context['url']}")

    if not parts:
        return ""
    return "\n\nBROWSER CONTEXT:\n" + "\n".join(parts)


def _extract_response_text(res_data: dict) -> str:
    """Extract assistant text from an OpenAI Responses API response object."""
    output = res_data.get("output", [])
    for item in output:
        if item.get("type") == "message" and item.get("role") == "assistant":
            for c in item.get("content", []):
                if c.get("type") == "output_text" and c.get("text"):
                    return c.get("text")
        elif "content" in item:
            for c in item.get("content", []):
                if isinstance(c, dict) and c.get("text"):
                    return c.get("text")
    return ""


async def chat_completion(
    messages: list[dict],
    page_context: dict | None = None,
    mode: str = "chat",
) -> dict:
    """
    Non-streaming chat completion via /v1/responses.
    """
    start = time.monotonic()
    trimmed = _trim_history(messages)
    context_block = _build_context_block(page_context, mode)
    system_content = SYSTEM_PROMPT + context_block

    api_messages = [{"role": "system", "content": system_content}]
    api_messages.extend(trimmed)

    url = f"{settings.AGENT_ROUTER_BASE_URL.rstrip('/')}/responses"
    payload = {
        "model": settings.AGENT_ROUTER_MODEL,
        "input": api_messages,
        "max_tokens": settings.CHAT_MAX_OUTPUT_TOKENS,
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        res = await client.post(url, headers=_get_headers(), json=payload)
        res.raise_for_status()
        res_data = res.json()

    duration_ms = int((time.monotonic() - start) * 1000)
    reply_text = _extract_response_text(res_data)
    usage = res_data.get("usage")

    logger.info("chat_completion duration=%dms usage=%s", duration_ms, usage)

    return {
        "content": reply_text,
        "usage": usage,
        "model": settings.AGENT_ROUTER_MODEL,
        "duration_ms": duration_ms,
    }


async def chat_completion_stream(
    messages: list[dict],
    page_context: dict | None = None,
    mode: str = "chat",
) -> AsyncGenerator[dict, None]:
    """
    Streaming chat completion via /v1/responses with SSE chunks.
    Yields {"event": "token", "text": "..."} and {"event": "done", ...}
    """
    start = time.monotonic()
    trimmed = _trim_history(messages)
    context_block = _build_context_block(page_context, mode)
    system_content = SYSTEM_PROMPT + context_block

    api_messages = [{"role": "system", "content": system_content}]
    api_messages.extend(trimmed)

    url = f"{settings.AGENT_ROUTER_BASE_URL.rstrip('/')}/responses"
    payload = {
        "model": settings.AGENT_ROUTER_MODEL,
        "input": api_messages,
        "stream": True,
        "max_tokens": settings.CHAT_MAX_OUTPUT_TOKENS,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", url, headers=_get_headers(), json=payload) as response:
                response.raise_for_status()

                current_event = None
                async for line in response.aiter_lines():
                    line = line.strip()
                    if not line:
                        continue

                    if line.startswith("event:"):
                        current_event = line[6:].strip()
                    elif line.startswith("data:"):
                        data_str = line[5:].strip()
                        if not data_str or data_str == "[DONE]":
                            continue

                        try:
                            chunk_data = json.loads(data_str)
                        except json.JSONDecodeError:
                            continue

                        # Check for text deltas in the Responses API stream
                        if current_event == "response.output_text.delta" or chunk_data.get("type") == "response.output_text.delta":
                            delta = chunk_data.get("delta")
                            if delta:
                                yield {"event": "token", "text": delta}
                        # Fallback for standard OpenAI chat delta format if returned
                        elif "choices" in chunk_data and chunk_data["choices"]:
                            delta_content = chunk_data["choices"][0].get("delta", {}).get("content")
                            if delta_content:
                                yield {"event": "token", "text": delta_content}

        duration_ms = int((time.monotonic() - start) * 1000)
        logger.info("chat_stream completed duration=%dms", duration_ms)
        yield {
            "event": "done",
            "model": settings.AGENT_ROUTER_MODEL,
            "duration_ms": duration_ms,
        }

    except Exception as e:
        logger.error("Streaming error: %s", str(e))
        yield {"event": "error", "message": _safe_error_message(e)}


async def summarize_page(title: str, url: str, text: str) -> dict:
    """
    Summarize a webpage given title, URL, and readable page text.
    """
    start = time.monotonic()
    cleaned_text = _truncate_context(text)
    user_content = f"Page title: {title}\nSource URL: {url}\n\nPage content:\n{cleaned_text}"

    api_messages = [
        {"role": "system", "content": SUMMARY_PROMPT},
        {"role": "user", "content": user_content},
    ]

    req_url = f"{settings.AGENT_ROUTER_BASE_URL.rstrip('/')}/responses"
    payload = {
        "model": settings.AGENT_ROUTER_MODEL,
        "input": api_messages,
        "max_tokens": settings.SUMMARY_MAX_OUTPUT_TOKENS,
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        res = await client.post(req_url, headers=_get_headers(), json=payload)
        res.raise_for_status()
        res_data = res.json()

    duration_ms = int((time.monotonic() - start) * 1000)
    reply_text = _extract_response_text(res_data)
    usage = res_data.get("usage")

    logger.info("summarize duration=%dms usage=%s", duration_ms, usage)

    return {
        "content": reply_text,
        "usage": usage,
        "model": settings.AGENT_ROUTER_MODEL,
        "duration_ms": duration_ms,
        "source_url": url,
        "title": title,
    }


async def summarize_page_stream(title: str, url: str, text: str) -> AsyncGenerator[dict, None]:
    """
    Streaming page summary via /v1/responses.
    """
    start = time.monotonic()
    cleaned_text = _truncate_context(text)
    user_content = f"Page title: {title}\nSource URL: {url}\n\nPage content:\n{cleaned_text}"

    api_messages = [
        {"role": "system", "content": SUMMARY_PROMPT},
        {"role": "user", "content": user_content},
    ]

    req_url = f"{settings.AGENT_ROUTER_BASE_URL.rstrip('/')}/responses"
    payload = {
        "model": settings.AGENT_ROUTER_MODEL,
        "input": api_messages,
        "stream": True,
        "max_tokens": settings.SUMMARY_MAX_OUTPUT_TOKENS,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", req_url, headers=_get_headers(), json=payload) as response:
                response.raise_for_status()

                current_event = None
                async for line in response.aiter_lines():
                    line = line.strip()
                    if not line:
                        continue

                    if line.startswith("event:"):
                        current_event = line[6:].strip()
                    elif line.startswith("data:"):
                        data_str = line[5:].strip()
                        if not data_str or data_str == "[DONE]":
                            continue

                        try:
                            chunk_data = json.loads(data_str)
                        except json.JSONDecodeError:
                            continue

                        if current_event == "response.output_text.delta" or chunk_data.get("type") == "response.output_text.delta":
                            delta = chunk_data.get("delta")
                            if delta:
                                yield {"event": "token", "text": delta}
                        elif "choices" in chunk_data and chunk_data["choices"]:
                            delta_content = chunk_data["choices"][0].get("delta", {}).get("content")
                            if delta_content:
                                yield {"event": "token", "text": delta_content}

        duration_ms = int((time.monotonic() - start) * 1000)
        yield {
            "event": "done",
            "model": settings.AGENT_ROUTER_MODEL,
            "duration_ms": duration_ms,
            "source_url": url,
            "title": title,
        }

    except Exception as e:
        logger.error("Summary stream error: %s", str(e))
        yield {"event": "error", "message": _safe_error_message(e)}


def _safe_error_message(e: Exception) -> str:
    """Return a user-safe error message without leaking secrets or traces."""
    msg = str(e).lower()
    if "authentication" in msg or "401" in msg or "api key" in msg:
        return "Authentication failed. Please check your AgentRouter API key in backend/.env."
    if "rate" in msg or "429" in msg:
        return "Rate limit reached. Please wait a moment and try again."
    if "insufficient" in msg or "credit" in msg or "quota" in msg:
        return "Insufficient credits. Please check your AgentRouter account balance."
    if "model" in msg and ("not found" in msg or "not available" in msg):
        return "The selected model is not available. Check your AgentRouter dashboard."
    if "timeout" in msg or "timed out" in msg:
        return "Request timed out. Please try again."
    if "connection" in msg:
        return "Cannot connect to the AI service. Please check your network connection."
    return "An unexpected error occurred. Please try again."
