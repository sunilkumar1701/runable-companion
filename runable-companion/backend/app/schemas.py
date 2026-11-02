"""
Pydantic request/response schemas for the Runable Companion backend.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional


class ChatMessage(BaseModel):
    """A single chat message."""

    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., min_length=1, max_length=12000)

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("user", "assistant"):
            raise ValueError("role must be 'user' or 'assistant'")
        return v


class PageContext(BaseModel):
    """Optional webpage context."""

    title: str = Field("", max_length=500)
    url: str = Field("", max_length=2000)
    text: str = Field("", max_length=12000)
    selected_text: str = Field("", max_length=4000)


class ChatRequest(BaseModel):
    """Request body for /api/chat and /api/chat/stream."""

    messages: list[ChatMessage] = Field(
        ..., min_length=1, max_length=20, description="Recent conversation messages"
    )
    page_context: Optional[PageContext] = None
    mode: str = Field(
        "chat", description="Interaction mode: chat, ask_selection, page_followup"
    )

    @field_validator("mode")
    @classmethod
    def validate_mode(cls, v: str) -> str:
        if v not in ("chat", "ask_selection", "page_followup"):
            raise ValueError("mode must be chat, ask_selection, or page_followup")
        return v

    @field_validator("messages")
    @classmethod
    def last_message_must_be_user(cls, v: list[ChatMessage]) -> list[ChatMessage]:
        if not v or v[-1].role != "user":
            raise ValueError("The last message must have role 'user'")
        return v


class SummarizeRequest(BaseModel):
    """Request body for /api/summarize."""

    title: str = Field("", max_length=500)
    url: str = Field("", max_length=2000)
    text: str = Field(..., min_length=10, max_length=12000)


class HealthResponse(BaseModel):
    status: str
    service: str


class ConfigResponse(BaseModel):
    model: str
    streaming: bool

