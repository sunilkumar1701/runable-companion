"""
Configuration — loads settings from environment variables via .env file.

All secrets stay server-side. The frontend never receives the API key.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend/ directory, fallback to .env.example if .env does not exist yet
_backend_dir = Path(__file__).resolve().parent.parent
_env_path = _backend_dir / ".env"
if _env_path.exists():
    load_dotenv(_env_path, override=True)
elif (_backend_dir / ".env.example").exists():
    load_dotenv(_backend_dir / ".env.example", override=True)


class Settings:
    """Application settings derived from environment variables."""

    # AgentRouter provider
    AGENT_ROUTER_API_KEY: str = os.getenv("AGENT_ROUTER_API_KEY", "")
    AGENT_ROUTER_BASE_URL: str = os.getenv(
        "AGENT_ROUTER_BASE_URL", "https://agentrouter.org/v1"
    )
    AGENT_ROUTER_MODEL: str = os.getenv("AGENT_ROUTER_MODEL", "gpt-6.1-sol")

    # Server
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "127.0.0.1")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))

    # Token-saving controls
    CHAT_MAX_OUTPUT_TOKENS: int = int(os.getenv("CHAT_MAX_OUTPUT_TOKENS", "500"))
    SUMMARY_MAX_OUTPUT_TOKENS: int = int(os.getenv("SUMMARY_MAX_OUTPUT_TOKENS", "700"))
    CHAT_HISTORY_LIMIT: int = int(os.getenv("CHAT_HISTORY_LIMIT", "6"))
    MAX_PAGE_CONTEXT_CHARS: int = int(os.getenv("MAX_PAGE_CONTEXT_CHARS", "8000"))

    # CORS
    CORS_ORIGINS: list[str] = [
        o.strip()
        for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if o.strip()
    ]

    def validate(self) -> list[str]:
        """Return a list of configuration problems (empty = valid)."""
        problems = []
        if not self.AGENT_ROUTER_API_KEY:
            problems.append(
                "AGENT_ROUTER_API_KEY is not set. "
                "Copy .env.example to .env and add your key."
            )
        if not self.AGENT_ROUTER_BASE_URL:
            problems.append("AGENT_ROUTER_BASE_URL is not set.")
        if not self.AGENT_ROUTER_MODEL:
            problems.append("AGENT_ROUTER_MODEL is not set.")
        return problems


settings = Settings()

