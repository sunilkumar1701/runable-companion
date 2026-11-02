"""
PDF Text Extraction Service — handles multi-page, scanned, and encrypted PDFs cleanly.
"""

import io
import logging
from pypdf import PdfReader
from pypdf.errors import PdfReadError

logger = logging.getLogger("runable.pdf_service")


def extract_text_from_pdf_bytes(
    pdf_bytes: bytes,
    max_chars: int = 12000,
    max_pages: int = 50,
) -> dict:
    """
    Extract readable text from PDF bytes page by page.
    Preserves page boundaries and detects encrypted or scanned documents.
    """
    if not pdf_bytes:
        return {
            "text": "",
            "num_pages": 0,
            "is_encrypted": False,
            "is_scanned": False,
            "is_truncated": False,
            "warning": "PDF content is empty.",
        }

    try:
        stream = io.BytesIO(pdf_bytes)
        reader = PdfReader(stream)

        # Check encryption
        if reader.is_encrypted:
            try:
                # Attempt decrypt with empty password for unauthenticated PDFs
                decrypt_success = reader.decrypt("")
                if decrypt_success == 0:
                    return {
                        "text": "",
                        "num_pages": len(reader.pages) if hasattr(reader, "pages") else 0,
                        "is_encrypted": True,
                        "is_scanned": False,
                        "is_truncated": False,
                        "warning": "This PDF document is password-protected or encrypted. Please provide an unlocked document.",
                    }
            except Exception:
                return {
                    "text": "",
                    "num_pages": 0,
                    "is_encrypted": True,
                    "is_scanned": False,
                    "is_truncated": False,
                    "warning": "This PDF document is password-protected or encrypted. Please provide an unlocked document.",
                }

        total_pages = len(reader.pages)
        pages_to_read = min(total_pages, max_pages)
        extracted_pages = []
        total_len = 0
        truncated = False

        for idx in range(pages_to_read):
            page = reader.pages[idx]
            page_text = page.extract_text() or ""
            clean_page = page_text.strip()

            if clean_page:
                header = f"--- Page {idx + 1} ---\n"
                page_block = header + clean_page
                if total_len + len(page_block) > max_chars:
                    # Truncate and stop
                    remaining_space = max_chars - total_len
                    if remaining_space > len(header):
                        extracted_pages.append(header + clean_page[: remaining_space - len(header)])
                    truncated = True
                    break
                else:
                    extracted_pages.append(page_block)
                    total_len += len(page_block)

        if pages_to_read < total_pages:
            truncated = True

        full_text = "\n\n".join(extracted_pages).strip()

        # Check for scanned / image-only PDF
        if not full_text or len(full_text) < 30:
            return {
                "text": "",
                "num_pages": total_pages,
                "is_encrypted": False,
                "is_scanned": True,
                "is_truncated": False,
                "warning": (
                    "This PDF appears to be a scanned document or contains only images. "
                    "OCR (Optical Character Recognition) is not supported; text extraction yielded no readable text."
                ),
            }

        if truncated:
            full_text += "\n\n[Content truncated for brevity: document exceeds extraction limits]"

        return {
            "text": full_text,
            "num_pages": total_pages,
            "is_encrypted": False,
            "is_scanned": False,
            "is_truncated": truncated,
            "warning": None,
        }

    except PdfReadError as e:
        logger.warning("PdfReadError during extraction: %s", str(e))
        return {
            "text": "",
            "num_pages": 0,
            "is_encrypted": False,
            "is_scanned": False,
            "is_truncated": False,
            "warning": f"Unable to read PDF file format: {str(e)}",
        }
    except Exception as e:
        logger.error("Unexpected error in PDF extraction: %s", str(e))
        return {
            "text": "",
            "num_pages": 0,
            "is_encrypted": False,
            "is_scanned": False,
            "is_truncated": False,
            "warning": f"PDF processing error: {str(e)}",
        }

