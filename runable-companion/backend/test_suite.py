"""
Test suite for Runable Companion Backend
Verifies routes, validation, configuration safety, and token-saving utilities.
"""

from starlette.testclient import TestClient
from app.main import app
from app.services.ai_service import _trim_history, _truncate_context
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


if __name__ == "__main__":
    test_health()
    test_config()
    test_validation_empty_messages()
    test_validation_invalid_role()
    test_missing_api_key_handling()
    test_token_saving_trim_history()
    test_token_saving_deduplication()
    test_context_truncation()
    print("\nALL BACKEND UNIT TESTS PASSED!")

