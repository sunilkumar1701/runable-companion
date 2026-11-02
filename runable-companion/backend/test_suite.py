"""
Test suite for Runable Companion Backend
Verifies routes, validation, configuration safety, and token-saving utilities.
"""

import io
from starlette.testclient import TestClient
from app.main import app
from app.services.ai_service import _trim_history, _truncate_context, _build_context_block
from app.schemas import PageContext, ChatRequest, ChatMessage, SummarizeRequest
from app.config import settings

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["status"] == "ok"
    assert data["service"] == "runable-companion-backend"
    assert "key" not in str(data).lower()
    print("PASS: /health endpoint works properly.")


def test_config():
    res = client.get("/api/config")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert "model" in data
    assert data["streaming"] is True
    assert "key" not in str(data).lower()
    print("PASS: /api/config returns safe model configuration.")


def test_validation_empty_messages():
    res = client.post("/api/chat", json={"messages": [], "mode": "chat"})
    assert res.status_code == 422
    print("PASS: /api/chat rejects empty messages.")


def test_validation_invalid_role():
    res = client.post(
        "/api/chat",
        json={
            "messages": [{"role": "hacker", "content": "hello"}],
            "mode": "chat",
        },
    )
    assert res.status_code == 422
    print("PASS: /api/chat rejects invalid roles.")


def test_missing_api_key_handling():
    # When API key is not configured, endpoints return safe 503
    saved_key = settings.AGENT_ROUTER_API_KEY
    try:
        settings.AGENT_ROUTER_API_KEY = ""
        res = client.post(
            "/api/chat",
            json={
                "messages": [{"role": "user", "content": "Hello"}],
                "mode": "chat",
            },
        )
        assert res.status_code == 503
        data = res.json()
        assert "not configured" in data["detail"].lower()
        print("PASS: /api/chat returns safe 503 when API key is missing.")
    finally:
        settings.AGENT_ROUTER_API_KEY = saved_key


def test_token_saving_trim_history():
    messages = [
        {"role": "user", "content": "msg 1"},
        {"role": "assistant", "content": "msg 2"},
        {"role": "user", "content": "msg 3"},
        {"role": "assistant", "content": "msg 4"},
        {"role": "user", "content": "msg 5"},
        {"role": "assistant", "content": "msg 6"},
        {"role": "user", "content": "msg 7"},
    ]
    trimmed = _trim_history(messages, limit=4)
    assert len(trimmed) == 4
    assert trimmed[-1]["content"] == "msg 7"
    print("PASS: History is trimmed to limit and preserves latest user message.")


def test_token_saving_deduplication():
    messages = [
        {"role": "user", "content": "hello"},
        {"role": "user", "content": "hello"},
        {"role": "assistant", "content": "hi"},
        {"role": "user", "content": "how are you?"},
    ]
    trimmed = _trim_history(messages, limit=6)
    assert len(trimmed) == 3
    print("PASS: Duplicate consecutive messages are pruned.")


def test_context_truncation():
    long_text = "A" * 12000
    truncated = _truncate_context(long_text, max_chars=8000)
    assert len(truncated) < 8100
    assert "truncated" in truncated.lower()
    print("PASS: Long page context is truncated to maximum character threshold.")


def test_build_context_block_selection():
    ctx = {
        "type": "selection",
        "selected_text": "This is a selected quote from the page.",
        "title": "Article Title",
        "url": "https://example.com/article",
    }
    block = _build_context_block(ctx, mode="ask_selection")
    assert "This is a selected quote" in block
    assert "Article Title" in block
    assert "https://example.com/article" in block
    print("PASS: _build_context_block correctly formats selection context.")


def test_build_context_block_webpage():
    ctx = {
        "type": "webpage",
        "text": "Full article readable content here with multiple sections.",
        "title": "Chennai - Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Chennai",
    }
    block = _build_context_block(ctx, mode="webpage")
    assert "Full article readable content here" in block
    assert "Chennai - Wikipedia" in block
    assert "https://en.wikipedia.org/wiki/Chennai" in block
    print("PASS: _build_context_block correctly includes extracted webpage text.")


def test_validation_webpage_mode():
    res = client.post(
        "/api/chat",
        json={
            "messages": [{"role": "user", "content": "What is this page about?"}],
            "page_context": {
                "type": "webpage",
                "text": "Article content...",
                "title": "Test Page",
                "url": "https://example.com",
            },
            "mode": "webpage",
        },
    )
    # Status code is 200 or whatever provider returns, not 422 validation error
    assert res.status_code in (200, 502, 503)
    print("PASS: /api/chat accepts 'webpage' mode with structured page_context.")


def test_summarize_endpoint():
    res = client.post(
        "/api/summarize",
        json={
            "title": "Chennai - Wikipedia",
            "url": "https://en.wikipedia.org/wiki/Chennai",
            "text": "Chennai, formerly Madras, is the capital of the Indian state of Tamil Nadu. Located on the Coromandel Coast of the Bay of Bengal, it is an important cultural, economic and educational center of South India.",
        },
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    assert "content" in data or "summary" in data
    assert data["model"] == "gpt-6.1-sol"
    print("PASS: /api/summarize succeeds with 200 OK and valid summary structure.")


def test_pdf_extract_endpoint():
    import base64
    from pypdf import PdfWriter

    # Create a small valid test PDF in memory
    writer = PdfWriter()
    writer.add_blank_page(width=200, height=200)
    pdf_buf = io.BytesIO()
    writer.write(pdf_buf)
    pdf_bytes = pdf_buf.getvalue()
    b64_pdf = base64.b64encode(pdf_bytes).decode("utf-8")

    res = client.post(
        "/api/extract-pdf",
        json={
            "base64_data": b64_pdf,
            "title": "Blank Test Document",
            "url": "https://example.com/test.pdf",
        },
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    assert data["num_pages"] == 1
    assert data["content_type"] == "pdf"
    # Blank PDF has no text, so is_scanned is flagged accurately
    assert data["is_scanned"] is True
    print("PASS: /api/extract-pdf successfully handles PDF and identifies image/empty content.")


def test_pdf_extract_local_file_path():
    import os
    sample_path = r"D:\Resume\Company switch\SUNIL_KUMAR_P.pdf"
    if os.path.exists(sample_path):
        res = client.post(
            "/api/extract-pdf",
            json={
                "file_path": sample_path,
                "title": "Sunil Kumar P CV",
                "url": "file:///D:/Resume/Company%20switch/SUNIL_KUMAR_P.pdf",
            },
        )
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        data = res.json()
        assert data["num_pages"] >= 1
        assert "Sunil Kumar P" in data["text"]
        assert "Full-Stack AI Developer" in data["text"]
        print("PASS: /api/extract-pdf extracts real local PDF file_path successfully.")
    else:
        print("SKIP: Local sample resume path not present on this machine.")


if __name__ == "__main__":
    test_health()
    test_config()
    test_validation_empty_messages()
    test_validation_invalid_role()
    test_missing_api_key_handling()
    test_token_saving_trim_history()
    test_token_saving_deduplication()
    test_context_truncation()
    test_build_context_block_selection()
    test_build_context_block_webpage()
    test_validation_webpage_mode()
    test_summarize_endpoint()
    test_pdf_extract_endpoint()
    test_pdf_extract_local_file_path()
    print("\nALL BACKEND UNIT TESTS PASSED!")


