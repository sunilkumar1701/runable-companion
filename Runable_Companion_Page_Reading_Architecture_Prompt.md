# Runable Companion --- Unified Page Reading Architecture

## HTML, React/SPAs, PDF Extraction, Page-Grounded AI, and Same-Conversation Context

## Role

Act as a senior Chrome Extension Manifest V3 engineer with strong
experience in JavaScript/TypeScript, React, browser content scripts, DOM
extraction, PDF.js, Chrome extension messaging, Python FastAPI,
conversation state management, and LLM integrations.

You are working on the existing **Runable Companion** project. Implement
a reliable page-reading system in the existing application. Do not
rebuild the extension, replace its architecture unnecessarily, or damage
existing features.

The goal is for Runable Companion to understand the page the user is
currently viewing, summarize it accurately, answer questions grounded in
its content, and preserve the user's existing conversation when webpage
text is attached through **Ask to Runable**.

Use public, documented browser-extension APIs and open-source libraries.
Do not copy proprietary code, private APIs, branding, or undocumented
behavior from Claude, Gemini, or other products.

------------------------------------------------------------------------

# 1. Core requirements

Support these page types:

1.  **Normal HTML websites** --- extract meaningful readable content
    from the rendered DOM using a content script.
2.  **React and other JavaScript-rendered websites** --- extract the
    rendered DOM after content appears; handle client-side navigation
    and changing content.
3.  **PDF documents opened in Chrome** --- use a deliberate PDF
    extraction path, preferably PDF.js in an extension-controlled
    context. Do not assume the built-in Chrome PDF viewer exposes its
    document text to ordinary content scripts.

All three strategies must feed one shared page-context contract and one
shared page-reading pipeline.

Also preserve these existing behaviors:

-   Summarize this page uses the actual active page's extracted content.
-   Users can ask questions about the current page.
-   Selected text can be attached using **Ask to Runable**.
-   Selected text is attached to the currently active conversation, not
    a newly created conversation.
-   Existing normal chat, streaming, Markdown rendering, settings,
    keyboard shortcuts, and side-panel behavior continue working.

Do not change the currently configured AI model or provider unless the
repository explicitly requires a compatible adjustment. Preserve the
existing AgentRouter integration.

------------------------------------------------------------------------

# 2. Mandatory repository inspection --- do this before editing

Do not start by changing code. First inspect the actual repository and
report a concise architecture map.

Inspect:

-   Complete project directory structure.
-   `package.json`, lockfile, Vite configuration, build scripts, and
    TypeScript configuration if present.
-   Manifest V3 configuration and declared permissions.
-   React entry points and side-panel initialization.
-   Background service worker and message listeners.
-   Existing content scripts and injection logic.
-   Active-tab detection and tab lifecycle handling.
-   Context-menu creation and click handling.
-   Page summarization UI and API calls.
-   Chat composer, selected-text attachment UI, message list, and
    conversation/thread state.
-   Conversation persistence and active conversation restoration.
-   FastAPI application, routes, Pydantic schemas, provider services,
    AgentRouter integration, and prompts.
-   Existing PDF dependencies or document-processing utilities.
-   Existing tests and test scripts.

Trace the actual event and data flow from: 1. User clicks **Summarize
this page**. 2. User asks a question that depends on the current page.
3. User selects webpage text and invokes **Ask to Runable**. 4. The
extension sends context to FastAPI and receives the response.

Identify existing reusable modules and the actual root causes of current
failures before implementing changes.

Do not assume filenames, framework versions, state-management libraries,
or API contracts. Adapt to the repository.

The backend must remain in the existing `runable-companion/backend/`
directory. Do not create a second backend.

------------------------------------------------------------------------

# 3. Target architecture

Implement or refactor toward the following logical architecture,
adapting names and boundaries to the real codebase:

``` text
runable-companion/
├── public/
│   └── manifest.json
├── src/
│   ├── background/
│   │   └── background.js
│   ├── content/
│   │   └── pageContentScript.js
│   ├── services/
│   │   ├── pageContextController.js
│   │   ├── pageExtractionService.js
│   │   ├── htmlExtractor.js
│   │   ├── spaReadiness.js
│   │   ├── pdfExtractor.js
│   │   ├── pageContextCache.js
│   │   └── aiService.js
│   ├── components/
│   │   └── existing chat and attachment components
│   └── existing React application files
└── backend/
    ├── existing FastAPI application
    ├── existing schemas
    └── existing AgentRouter/provider services
```

This is a conceptual architecture, not a mandate to create every file.
Reuse existing modules and avoid duplicate services.

## Responsibilities

-   **React side panel:** initiates user actions and displays results.
-   **Background service worker:** resolves the active tab, coordinates
    extraction, handles extension events, and routes context-menu
    events.
-   **Content script:** reads rendered HTML/React DOM and returns
    structured text. It must not contain AI credentials or call the
    model directly.
-   **Page context controller:** associates each extraction with the
    correct tab, URL, title, and request.
-   **HTML extractor:** cleans and structures readable DOM content.
-   **SPA readiness handler:** waits a bounded amount of time for
    rendered content and detects route/content changes.
-   **PDF extractor:** extracts text page by page using PDF.js or
    another justified, tested implementation.
-   **Page context manager/cache:** validates, stores, reuses, and
    invalidates extracted context safely.
-   **FastAPI backend:** validates bounded page context and sends it
    through the existing AgentRouter integration.
-   **Conversation manager:** appends messages/context to the current
    conversation without resetting it.

Do not create three separate page-context formats. All extractors must
return a common normalized result.

------------------------------------------------------------------------

# 4. Unified page-context contract

Define or adapt one shared frontend/backend contract. Conceptual
example:

``` ts
type PageContentType = "html" | "pdf" | "unknown";

type PageExtractionStatus =
  | "success"
  | "partial"
  | "empty"
  | "unsupported"
  | "protected"
  | "loading"
  | "permission_error"
  | "extraction_error";

type PageContext = {
  pageTitle: string;
  sourceUrl: string;
  tabId?: number;
  contentType: PageContentType;
  extractionMethod: string;
  extractedAt: string;
  status: PageExtractionStatus;
  content: string;
  pageCount?: number;
  extractedPageCount?: number;
  isTruncated: boolean;
  warnings: string[];
  characterCount: number;
};
```

The actual implementation must keep frontend types, FastAPI/Pydantic
schemas, and runtime validation synchronized.

Requirements:

-   Distinguish a successful extraction from an empty result or failure.
-   Never turn an extraction failure into a successful empty page.
-   Keep page title, URL, tab ID, and extraction request associated.
-   Include PDF page boundaries/page numbers when available.
-   Include truncation and warnings.
-   Do not send raw HTML or PDF binary/base64 to the language model.
-   Bound content size and request size with configurable limits.

------------------------------------------------------------------------

# 5. Extraction strategy A --- normal HTML websites

Use a content script to inspect the **rendered DOM** after a
user-initiated action.

Extract meaningful content in a structured, readable order. Prioritize:

-   `<main>` and `<article>`.
-   Main content containers when identifiable.
-   Headings (`h1`--`h6`).
-   Paragraphs.
-   Ordered and unordered lists.
-   Relevant tables, headers, and rows.
-   Captions and meaningful labels.

Preserve heading hierarchy, paragraph order, list structure, and section
boundaries where practical.

Ignore or remove:

-   `script`, `style`, `noscript`, and template content.
-   Hidden or non-rendered elements.
-   SVG/icon noise.
-   Repeated navigation, footer, and header boilerplate when
    identifiable.
-   Advertisements and unrelated sidebars where identifiable.
-   Cookie banners and consent overlays when safely identifiable.
-   Password fields and form controls.
-   User-entered form values, private input values, and sensitive
    fields.
-   Buttons and controls that add no meaningful page information.

Do not assume the largest DOM element is always the article. Do not
remove meaningful content merely because it is inside a generic
container.

Use a sensible fallback when `<main>` or `<article>` is absent. A
fallback may inspect visible text-bearing elements and rank candidate
content regions, but must avoid returning the entire page chrome.

Use visibility checks that account for hidden elements and avoid reading
form values. Do not interact with the page or alter its state.

The extractor should return structured text rather than raw `innerHTML`.

------------------------------------------------------------------------

# 6. Extraction strategy B --- React websites and SPAs

React is not a separate document format. The content script must read
the DOM after the application has rendered its content.

Requirements:

-   Support client-rendered React and other JavaScript-rendered pages.
-   Wait for `document.readyState` as appropriate, then use a bounded
    DOM-readiness/stability strategy.
-   Make readiness timeout and stability duration configurable.
-   Avoid indefinite polling, continuous scraping, or unnecessary
    MutationObservers.
-   If using a MutationObserver, disconnect it after the bounded
    readiness window.
-   Do not reload the website.
-   Do not interfere with React internals, component state, or
    application runtime.
-   Handle delayed content and common loading states.
-   If useful content has not appeared by timeout, return a `loading` or
    `partial` status and offer retry.
-   Handle SPA route changes in the same tab, including navigation that
    does not reload the document.
-   Invalidate cached content when the URL/route or meaningful document
    content changes.
-   Avoid stale extraction after navigation.
-   Do not treat a page as ready merely because
    `document.readyState === "complete"`.

Use a bounded and event-driven approach where possible. A practical
approach can combine: 1. Immediate URL/title capture. 2. A short bounded
wait for DOM content. 3. A short DOM-stability check. 4. Extraction. 5.
A final URL/tab identity validation.

Do not continuously scrape pages in the background.

------------------------------------------------------------------------

# 7. Extraction strategy C --- PDF documents in Chrome

## Critical technical rule

Do not assume a normal content script can read the text shown inside
Chrome's built-in PDF viewer. The built-in viewer is browser-controlled
and may be isolated from ordinary webpage DOM access.

Inspect the actual extension environment and implement a supported PDF
strategy.

Preferred approach:

1.  Detect likely PDF navigation using URL metadata,
    response/content-type information when available, or supported tab
    metadata.
2.  Determine whether the PDF bytes can be accessed through a permitted,
    user-initiated request.
3.  Use PDF.js in an extension-controlled context (for example, an
    extension page/worker or an appropriate bundled module) to parse
    accessible PDF bytes.
4.  Extract text page by page.
5.  Return text with page boundaries such as `[Page 1]`, `[Page 2]`.
6.  Feed the extracted text into the same normalized `PageContext`
    contract used by HTML extraction.

Before implementing PDF.js:

-   Check package/bundler compatibility with the existing Vite build.
-   Use a compatible PDF.js version and worker configuration.
-   Bundle dependencies locally where required; do not rely on a remote
    CDN.
-   Verify the library's license and include any required notices.
-   Avoid loading arbitrary executable code from the PDF.

PDF requirements:

-   Support publicly accessible, text-based PDFs when the extension can
    obtain their bytes with permitted permissions.
-   Support multi-page documents and preserve page order.
-   Enforce configurable maximum file size, page count, and extracted
    character count.
-   Include total page count and extracted page count when available.
-   Mark content as truncated when limits are reached.
-   Detect empty/image-only PDFs and clearly explain that OCR is not
    implemented unless it actually is.
-   Detect password-protected/encrypted PDFs and return a clear status.
-   Handle malformed, unavailable, or unsupported PDFs honestly.
-   Do not send PDF binary data or base64 blobs to the LLM.
-   Do not fetch arbitrary URLs through the backend to work around
    browser CORS or authentication.
-   Do not bypass login, paywalls, CORS, browser security, or website
    access controls.
-   Do not claim that a PDF was extracted when only the PDF viewer
    URL/title was obtained.

Special cases:

-   **Chrome built-in PDF viewer:** If bytes cannot be accessed through
    the selected supported strategy, show a clear limitation and provide
    a supported user-initiated alternative, such as opening/providing
    the PDF through an extension-controlled document flow.
-   **Local `file://` PDF:** Do not assume access. Explain and request
    the necessary user-enabled file access only if the implementation
    supports it.
-   **Authenticated PDFs:** Do not bypass authentication or silently
    fetch through another identity. Use only bytes legitimately
    available to the extension in the user's browser context.
-   **Scanned PDFs:** State that OCR is unsupported unless an OCR
    implementation is added and tested.

Do not add broad host permissions automatically. Justify every
permission required by the chosen PDF approach.

------------------------------------------------------------------------

# 8. Active-tab targeting and extraction lifecycle

The page-reading request must target the exact tab the user is viewing
when the action is triggered.

Requirements:

-   Resolve the active tab at action time.
-   Capture tab ID, URL, and title for the request.
-   Do not reuse a stale tab ID.
-   Do not accidentally read the side panel, extension page, or another
    tab.
-   Associate the response with the original extraction request.
-   Detect navigation or tab replacement during extraction.
-   Before accepting the result, verify that the tab still represents
    the same page/document.
-   If the URL changes during extraction, discard or mark the result
    stale and do not attach it to the new page.
-   Handle tab closure, reload, navigation, and service-worker restart.
-   Use existing extension messaging patterns where possible.

Do not assume a service worker remains alive indefinitely. Use
message-driven operations and persist only the minimal state needed for
recovery.

------------------------------------------------------------------------

# 9. Page context cache and reuse

Implement a small, explicit page-context cache only if it fits the
current architecture.

Cache identity should include enough information to prevent cross-page
reuse, such as:

-   Tab ID.
-   Canonical/current URL.
-   Document or navigation identity where available.
-   Extraction timestamp.
-   Content type.

Requirements:

-   Reuse already extracted context for repeated questions on the same
    unchanged page when safe.
-   Do not re-extract or resend the full page for every follow-up
    unnecessarily.
-   Invalidate when the tab navigates, the SPA route changes, or
    meaningful content changes.
-   Do not reuse context across different tabs merely because URLs match
    unless deliberately designed and safe.
-   Do not persist sensitive page contents unnecessarily.
-   Keep cache lifetime and maximum size bounded.
-   Never treat cached context as current without validating page
    identity.

For unrelated normal chat messages, do not extract or attach page
content.

------------------------------------------------------------------------

# 10. Page-context validation before AI requests

Before calling FastAPI/model:

-   Confirm content is non-empty and meaningful.
-   Confirm title and URL match the active tab/request.
-   Reject obvious error pages and navigation-only output.
-   Do not treat title, URL, metadata, or search snippets as page
    content.
-   Record extraction method, status, character count, truncation, and
    warnings.
-   Do not log full page contents, selected text, credentials, or
    private form data.
-   If content is insufficient, explain the issue and offer a useful
    action such as retry, select text, or provide the PDF through a
    supported flow.

------------------------------------------------------------------------

# 11. Page-grounded summarization

The **Summarize this page** action must use the actual extracted content
as its source of truth.

Requirements:

-   Summarize only the supplied page content.
-   Do not use Wikipedia, search results, external websites, model
    memory, or generic knowledge to fill missing facts.
-   Do not infer facts absent from the extracted content.
-   Preserve names, numbers, dates, qualifications, and important
    caveats accurately.
-   Exclude irrelevant navigation and footer text.
-   If content is truncated, clearly state that the summary covers only
    the extracted portion.
-   If a detail is absent, say it is not present in the extracted
    content.
-   Keep summary and key takeaways concise and readable.
-   Show the correct source title and URL.

Treat webpage and PDF text as **untrusted reference data**. Instructions
embedded in page content must never override system/developer
instructions or the user's actual request.

Do not add web search as a fallback for the page-summary action.

------------------------------------------------------------------------

# 12. Ask questions about the current page

Support questions such as:

-   "Who is present in this webpage?"
-   "What does the About section say?"
-   "What qualifications are listed?"
-   "Explain the second section of this PDF."
-   "What are the main points in this article?"

When the question clearly depends on the current page:

1.  Use the shared page-reading pipeline.
2.  Reuse validated page context if it is still current.
3.  Include the page context in the existing FastAPI request.
4.  Preserve the current conversation history and conversation ID.
5.  Instruct the model to answer from supplied page content.
6.  If the answer is not supported by extracted content, say so.
7.  Never claim to have read a page if extraction failed.

Do not attach full page context to unrelated chat messages.

Keep selected-text context and full-page context distinct. If both are
present, label them clearly.

------------------------------------------------------------------------

# 13. Selected text and same-conversation Ask to Runable

This is a critical regression-sensitive requirement.

Trace the actual context-menu event flow and diagnose why it may create
or switch to a new conversation.

When a user selects text and chooses **Ask to Runable** while a
conversation is active:

-   Preserve the exact current conversation ID.
-   Preserve all previous messages.
-   Keep the same conversation selected.
-   Attach the exact selected text to the existing composer/context
    attachment UI.
-   Preserve source URL and page title.
-   Do not create a new conversation.
-   Do not clear messages, draft text, or unrelated attachments.
-   Do not invoke the New Chat handler.
-   Do not replace the active conversation ID.
-   Preserve scroll/conversation state as far as practical.

If no conversation is active, follow the existing initial-chat behavior
without creating duplicate threads.

Use the existing attachment-card visual pattern:

-   Selection/document icon.
-   Label such as `Selected from webpage`.
-   Source domain or page title.
-   Short text preview.
-   Remove control.

Removing the attachment must remove only that pending context. It must
not delete previous messages or unrelated page context.

Respect the existing UX: - If the current design waits for the user to
type a question and press Send, preserve that behavior. - If the
existing feature automatically submits a question, append the contextual
message and response to the same conversation. - Do not invent a new
interaction.

If the service worker communicates with the side panel, pass selected
text, source URL, page title, and event metadata. Route the event to the
existing active side-panel session. Handle panel unmount/remount without
corrupting or resetting the conversation.

------------------------------------------------------------------------

# 14. Frontend/backend integration

Inspect and reuse the existing FastAPI and AgentRouter implementation.

Requirements:

-   Keep the backend in the existing backend directory.
-   Update Pydantic schemas and frontend API types together.
-   Reuse the existing provider/request builder.
-   Preserve existing normal chat and streaming behavior.
-   Keep API credentials exclusively in backend environment variables.
-   Never expose provider keys to content scripts or extension bundles.
-   Treat page content as untrusted data.
-   Bound request size, page text, and PDF extraction.
-   Avoid duplicate model calls and duplicate summarization.
-   Avoid sending the same page context repeatedly when a validated
    context reference/cache mechanism can safely be used.
-   Provide clear errors for provider 400/401/403/429/5xx and timeouts.
-   Do not report success if extraction or the provider call failed.
-   Do not log full webpage/PDF contents.

Use the existing model configuration. Do not silently switch models.

------------------------------------------------------------------------

# 15. Manifest permissions, privacy, and security

Review the current Manifest V3 permissions before changing them.

-   Request only permissions needed by the actual implementation.
-   Prefer `activeTab` for user-initiated access where it is sufficient.
-   Use `scripting` only if script injection is required.
-   Add host permissions only when justified by the selected PDF or
    extraction strategy.
-   Do not add `<all_urls>` by default.
-   Explain every additional permission and its purpose.
-   Do not collect page content continuously.
-   Extract only after a user-initiated action or a clearly
    page-dependent user message.
-   Do not scrape linked pages automatically.
-   Do not bypass authentication, paywalls, CORS, or browser
    restrictions.
-   Do not collect passwords or user-entered form values.
-   Do not expose AI credentials in the extension.
-   Do not send page contents to analytics or logs.
-   Treat webpage/PDF content as untrusted input.

Protected browser pages, Chrome Web Store pages, extension pages, and
other restricted origins must return an honest unsupported/protected
status.

------------------------------------------------------------------------

# 16. Testing and acceptance criteria

Do not declare completion based only on a healthy backend or successful
normal chat response.

## Test A --- Normal HTML website

1.  Open a public article page.
2.  Trigger Summarize this page.
3.  Verify meaningful article text is extracted from the rendered DOM.
4.  Verify headings and paragraphs retain a sensible order.
5.  Verify navigation/footer noise is reduced.
6.  Ask a question about a specific paragraph.
7.  Confirm the answer is supported by extracted content.

## Test B --- React-rendered website

1.  Open a React-rendered page.
2.  Wait for client-rendered content.
3.  Trigger extraction.
4.  Verify rendered text is obtained.
5.  Navigate to another route using SPA navigation without a full
    reload.
6.  Trigger extraction again.
7.  Verify the new route's content is used and stale context is not
    reused.
8.  Test a delayed-loading page and verify bounded timeout behavior.

## Test C --- PDF

Test, where available:

-   Public text-based PDF.
-   Multi-page PDF.
-   Scanned/image-only PDF.
-   Password-protected PDF.
-   Large PDF.
-   Local PDF if supported.

Verify:

-   The actual PDF extraction strategy is used.
-   Text is extracted page by page.
-   Page order is preserved.
-   Page numbers/boundaries are included.
-   Limits and truncation are reported.
-   Scanned PDFs are not claimed to support OCR unless OCR exists.
-   Password-protected/inaccessible cases return honest errors.
-   No PDF binary/base64 is sent to the LLM.

## Test D --- Active-tab correctness

1.  Open two different webpages in two tabs.
2.  Activate one tab and trigger extraction.
3.  Switch tabs and trigger extraction again.
4.  Verify each result belongs to the correct tab.
5.  Navigate during extraction and verify stale results are rejected.

## Test E --- Same-conversation Ask to Runable

1.  Open a webpage.
2.  Start a conversation in Runable.
3.  Send at least two messages and receive responses.
4.  Select a paragraph on the webpage.
5.  Right-click and choose Ask to Runable.
6.  Verify the same conversation remains open.
7.  Verify all previous messages remain visible.
8.  Verify the selection attachment appears in the existing composer.
9.  Send a question about the selection.
10. Verify the response is appended to the same conversation.
11. Verify the conversation ID did not change.

## Test F --- Attachment removal

1.  Attach selected text.
2.  Remove it using the X control.
3.  Send a normal message.
4.  Verify the removed text is not included.
5.  Verify previous conversation messages remain intact.

## Test G --- Normal chat isolation

1.  Open a webpage.
2.  Send an unrelated normal chat message.
3.  Verify no unnecessary full-page extraction occurs.
4.  Confirm normal chat and streaming continue to work.

## Test H --- Regression

Verify:

-   Side panel open/close.
-   Existing greeting and feature cards.
-   Normal chat and streaming.
-   Markdown rendering.
-   Conversation history and persistence.
-   Explicit New Chat action.
-   Context-menu Ask to Runable.
-   Selected-text attachment/removal.
-   Summarize this page.
-   Existing keyboard shortcuts.
-   More Options pages.
-   Existing settings and controls.

------------------------------------------------------------------------

# 17. Required implementation sequence

Follow this order:

1.  Inspect repository, screenshots, and current implementation.
2.  Map the actual event/data flow.
3.  Reproduce and diagnose the current extraction/summarization
    failures.
4.  Diagnose the conversation reset caused by Ask to Runable.
5.  Define the unified PageContext contract.
6.  Implement or refactor normal HTML extraction.
7.  Add React/SPA readiness and route invalidation.
8.  Implement a deliberate PDF.js-based strategy where bytes are
    legitimately accessible.
9.  Add active-tab validation and stale-result protection.
10. Add bounded context caching/reuse if appropriate.
11. Connect all page-aware actions to the shared extraction pipeline.
12. Make summarization strictly page-grounded.
13. Fix Ask to Runable to preserve the active conversation.
14. Synchronize frontend and FastAPI schemas.
15. Run relevant tests and regression checks.
16. Report exact changes and remaining limitations.

Make the smallest complete set of changes. Do not rewrite the side panel
or introduce a second conversation store.

------------------------------------------------------------------------

# 18. Required final implementation report

After implementation, provide:

1.  **Root causes**
    -   Why page summaries were not grounded in the active page.
    -   Whether the old implementation sent only URL/title or incomplete
        content.
    -   Why Ask to Runable reset or switched conversations.
2.  **Architecture**
    -   Actual implemented page-reading architecture.
    -   HTML extraction flow.
    -   React/SPA handling.
    -   PDF extraction flow and PDF.js worker/bundling approach.
    -   Shared PageContext contract.
    -   Cache and invalidation strategy.
    -   Active-tab and stale-result protection.
3.  **Conversation fix**
    -   How the active conversation ID is preserved.
    -   How selected text is attached.
    -   How attachment removal works.
    -   Whether sending is manual or automatic according to existing UX.
4.  **Files changed**
    -   Every modified and newly created file with its exact path.
    -   A short explanation of each change.
5.  **Permissions**
    -   Every permission added or changed.
    -   Why it is necessary.
    -   Any user action needed to enable access.
6.  **API contract**
    -   Actual request and response examples matching the implemented
        code.
    -   How page and selected-text context are represented.
7.  **Tests**
    -   Tests actually executed.
    -   Passed, failed, and not-run tests separated clearly.
    -   Do not claim unexecuted tests passed.
8.  **Run instructions**
    -   Exact PowerShell commands for frontend and backend.
    -   Required environment/configuration changes.
9.  **Limitations**
    -   Login-protected pages.
    -   Browser-internal/restricted pages.
    -   Built-in Chrome PDF viewer limitations.
    -   Scanned PDFs/OCR.
    -   Password-protected PDFs.
    -   Local files and file access.
    -   Large documents and extraction limits.

------------------------------------------------------------------------

# Definition of done

The task is complete only when:

-   Normal HTML pages are extracted from their rendered DOM.
-   React and other SPA pages are extracted after rendering and
    refreshed correctly after route changes.
-   PDF extraction uses an explicit, tested strategy such as PDF.js on
    legitimately accessible bytes.
-   The implementation does not falsely claim that a content script can
    read Chrome's internal PDF viewer.
-   All extractors return the same normalized page-context structure.
-   Active-tab identity is verified and stale results are rejected.
-   Page summaries use actual extracted content and do not substitute
    Wikipedia, search results, or model memory.
-   Page-dependent questions receive the relevant page context.
-   Ask to Runable attaches selected text to the existing active
    conversation.
-   The active conversation ID and previous messages remain unchanged.
-   Removing an attachment prevents that context from being sent.
-   Normal chat does not trigger unnecessary page extraction.
-   Existing extension features and visual design remain intact.
-   Tests and limitations are reported truthfully.

**Start by inspecting the existing repository and tracing the real
state/data flow. Diagnose before editing. Implement a unified, reliable
page-reading architecture using the smallest complete set of changes. Do
not create a new conversation when the user invokes Ask to Runable from
an existing conversation.**
