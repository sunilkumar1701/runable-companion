# Runable Companion --- Phase 1 UI Development Prompt

## Role

Act as a senior frontend engineer experienced in React and Chromium
extensions. Build **Phase 1 only** of a browser extension named
**Runable Companion**. Recreate the supplied reference screenshot as
closely as possible. The screenshot is the visual source of truth for
layout, spacing, typography, colors, borders, shadows, icons, and
component placement.

This is a visual demo using local dummy data only. Do not implement
Phases 2--4.

## 1. Goal and technology

Build a real Chromium browser extension using:

-   React.js with JavaScript and JSX (not TypeScript)
-   Vite
-   Chrome Extension Manifest V3
-   Tailwind CSS for layout, spacing, responsive breakpoints, and utility styling
-   `lucide-react` for interface icons
-   Optional: Bootstrap 5 only if a specific component genuinely benefits from it; do not combine Bootstrap and Tailwind utilities for the same elements
-   Free and open-source packages/resources only

Use Tailwind CSS as the primary styling system. Keep a small amount of custom CSS only for design tokens, fine visual details, and browser-specific layout behavior.

The UI should appear in the browser's right-side panel. The host webpage
remains outside the extension; do not recreate the webpage inside the
extension.

## 2. Browser compatibility and responsive requirements

The extension must support **Google Chrome and Microsoft Edge**.

- Use Manifest V3 and Chromium-compatible extension APIs.
- Keep browser-specific API calls behind a small compatibility/helper layer instead of scattering them through React components.
- Detect whether the required side-panel API is available before calling it.
- Verify the extension build and loading flow in both Chrome and Edge.
- If an API behaves differently between browsers, document the difference and provide a graceful fallback rather than allowing the UI to fail.
- Do not use browser APIs that are unavailable in the target browsers without feature detection.

The UI must be fully responsive across different side-panel sizes and viewport dimensions:

- Support narrow widths from approximately 320px upward.
- Match the supplied reference at approximately 520–540px panel width.
- Adapt to wider panels without stretching cards or text excessively.
- Support short and tall viewport heights, browser zoom, and window resizing.
- Prevent horizontal overflow and clipped controls.
- Use Tailwind responsive breakpoints and flexible CSS sizing (`min-width: 0`, `max-width: 100%`, `flex-wrap`, `clamp()`, and grid/flex layouts where appropriate).
- Keep the header usable at all widths.
- Keep the composer anchored at the bottom while allowing the main content area to scroll when vertical space is limited.
- At very narrow widths, reduce gaps and card padding; if four cards cannot remain readable, use a compact two-column grid rather than allowing horizontal scrolling.
- Test at minimum widths of 320px, 360px, 400px, 520px, 768px, and 1024px.

Do not assume that the side panel always has a fixed width or height.

## 3. Reference layout

Reproduce the right-side Runable Companion panel from the attached
screenshot:

1.  Header
2.  Welcome section
3.  Four quick-action cards in one row
4.  Chat composer anchored to the bottom

The panel should fill the available side-panel height, use a warm
off-white/beige background, and avoid adding sections that are not in
the reference.

Target width: approximately 520--540px. It must remain usable at
360--400px.

## 4. Header

Left side: - Rounded-square logo tile with a dark `R` as a temporary
Runable mark. - Product name: **Runable Companion**.

Right side: - Circular plus (+) button for New chat. - Circular
vertical-ellipsis button for More options. - Subtle divider below the
header.

### More options dropdown

Anchor a floating dropdown below the ellipsis button. Include these
items in this exact order:

1.  New chat
2.  Artifacts
3.  Scheduled tasks
4.  Plugins
5.  Notetaker
6.  Divider
7.  Settings
8.  Account

Use appropriate Lucide icons, consistent row heights and aligned
icons/text. The menu should have a warm white surface, rounded corners,
subtle border, and soft shadow. Keep it inside the side panel.

**Initial demo state:** Open this menu by default on first load to match
the supplied screenshot. The ellipsis toggles it. Clicking outside or
pressing Escape closes it. New chat resets the home UI. Other menu items
may show a small local demo toast; do not build their full pages.

## 5. Welcome section

Center this section in the available space between the header and action
cards. Include:

-   A small four-point sparkle icon.
-   Heading: **Good afternoon, Sunil**
-   Supporting text: **How can Runable help you today?**

Use centered alignment, generous whitespace, a large regular/medium
heading, and smaller muted-grey supporting text. Use the static name
`Sunil`; do not implement authentication or profile fetching.

## 6. Quick-action cards

Render four equally sized cards in one horizontal row:

1.  **Summarize this page**
2.  **Create slides**
3.  **Create report**
4.  **More tools**

Each card has an icon near the top, label below, subtle 1px border,
rounded corners, warm off-white/white surface, and consistent dimensions
and padding.

Suggested Lucide icons: - Summarize: `FileText` - Slides: `Presentation`
or `Monitor` - Report: `ChartNoAxesCombined` or `FileChartLine` - More
tools: `Grid2X2`

Icon accents: - Summarize: dark brown/near-black - Slides: orange -
Report: blue - More tools: dark brown/near-black

Keep all four cards in one row at the reference width. At narrower
widths, reduce gaps and padding before changing the layout.

Phase 1 interactions are placeholders only: - Summarize this page: toast
`Summarize this page — coming in Phase 4` - Create slides: toast
`Create slides — demo placeholder` - Create report: toast
`Create report — demo placeholder` - More tools: toast
`More tools — demo placeholder`

Do not implement summarization, slide generation, report generation, or
backend requests.

## 7. Chat composer

Anchor a large rounded composer at the bottom of the panel.

Input: - Placeholder: **Ask Runable anything...** - Multiline input that
expands for a few lines. - Enter may add a local demo message or show a
placeholder toast. - Shift+Enter inserts a newline.

Toolbar, in one row: - Plus icon button on the left. - Agent selector
with small agent icon, **Agent** label, and chevron. - Flexible space. -
**Auto** model selector with chevron. - Circular microphone icon button
on the right.

Use soft circular backgrounds for plus and microphone, a pill background
for Agent, and a compact dropdown style for Auto. Typing must work.
Agent and Auto open small local dropdowns with dummy options. Plus and
microphone show demo placeholder notifications. No AI, voice, or backend
integration.

## 8. Visual design system

Match the screenshot; do not introduce a different design language. Use
these initial CSS variables and tune them against the screenshot:

``` css
:root {
  --panel-bg: #faf8f5;
  --surface: #fffefd;
  --surface-soft: #f5f1ec;
  --text-primary: #171717;
  --text-secondary: #686868;
  --text-muted: #a69b91;
  --border: #e9e3dd;
  --accent-brown: #3b2b20;
  --accent-orange: #ff9800;
  --accent-blue: #1683ff;
  --shadow-soft: 0 4px 18px rgba(45, 32, 22, 0.08);
}
```

Typography: - Prefer **Inter**, loaded from a free source such as Google
Fonts or bundled locally under a compatible free license. - Provide
system-font fallbacks. - Use regular and medium weights for most text. -
Keep text clean and readable at side-panel dimensions.

Shapes and spacing: - Rounded corners similar to the reference. - Subtle
borders, not heavy outlines. - Soft shadows only for floating
menus/elevated surfaces. - Consistent spacing scale. - Avoid saturated
card backgrounds and unnecessary gradients.

Use `lucide-react`; do not use emoji as interface icons, paid icon
packs, or external icon APIs.

## 9. Extension setup

Use Manifest V3 and configure the extension as **Runable Companion**.

-   Provide a simple temporary extension icon if needed.
-   Use the Chrome Side Panel API where appropriate.
-   Clicking the extension toolbar icon should open the side panel.
-   Keep extension UI independent of the host webpage.
-   Use only minimum permissions required for Phase 1.
-   Do not implement context menus, selected-text transfer, keyboard
    shortcuts, or webpage extraction yet; these belong to later phases.

If the side panel cannot be previewed directly during development,
provide a Vite preview mode that renders the same React UI at a
realistic side-panel width. Reuse the same React UI in preview and
extension builds.

## 10. Responsive behavior

-   Target 520--540px panel width for reference matching.
-   Support narrower widths around 360--400px.
-   Keep four action cards in one row at reference width.
-   Reduce card gaps/padding at narrower widths.
-   Prevent horizontal scrolling.
-   Keep the composer visible at the bottom.
-   If panel height is short, allow the main content area to scroll
    while keeping the header and composer usable.

## 11. Maintainable folder structure

Do not put the entire UI in one component. Use reusable components and
keep repeated content in data arrays.

Suggested structure:

``` text
runable-companion/
├── public/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── MoreOptionsMenu/
│   │   │   ├── MoreOptionsMenu.jsx
│   │   │   └── MoreOptionsMenu.css
│   │   ├── WelcomeSection/
│   │   │   ├── WelcomeSection.jsx
│   │   │   └── WelcomeSection.css
│   │   ├── QuickActions/
│   │   │   ├── QuickActions.jsx
│   │   │   └── QuickActions.css
│   │   ├── ChatComposer/
│   │   │   ├── ChatComposer.jsx
│   │   │   └── ChatComposer.css
│   │   ├── Dropdown/
│   │   │   ├── Dropdown.jsx
│   │   │   └── Dropdown.css
│   │   └── Toast/
│   │       ├── Toast.jsx
│   │       └── Toast.css
│   ├── data/
│   │   └── demoData.js
│   ├── hooks/
│   │   └── useOutsideClick.js
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

You may adapt this where Vite or extension build requirements demand it,
but retain component separation and reusability.

Component responsibilities: - `Header`: logo, product name, New chat,
ellipsis. - `MoreOptionsMenu`: menu rows and click handling. -
`WelcomeSection`: sparkle, greeting, supporting text. - `QuickActions`:
reusable card data and rendering. - `ChatComposer`: input and toolbar
controls. - `Dropdown`: reusable dropdown behavior where appropriate. -
`Toast`: small demo feedback. - `useOutsideClick`: reusable
outside-click hook. - `demoData.js`: menu items, action cards, dropdown
options, and static demo values.

## 12. Packages and restrictions

Prefer this small free dependency set: - `react` - `react-dom` -
`vite` - `lucide-react`

Use React state and CSS for menus, dropdowns, and toasts. Avoid a large
UI framework unless genuinely necessary.

Do not use paid UI kits, paid fonts, paid icon libraries, external AI
APIs, backend services, databases, authentication services, or
unnecessary analytics/tracking packages.

## 13. Dummy data and strict scope

All Phase 1 data and interactions must be local and dummy: - User name:
`Sunil` - Product name: `Runable Companion` - Menu and action labels -
Agent dropdown options - Model dropdown options - Toast messages -
Optional sample chat interactions

Do not connect to Runable's real backend, call an AI model, fetch user
data, summarize webpage content, read selected webpage text, add a
browser context menu, add a keyboard shortcut, or implement
authentication.

These capabilities are reserved for later phases: - Phase 2: Ask with
Runable - Phase 3: Keyboard shortcut to open the side panel - Phase 4:
Summarize this page

## 14. Accessibility

-   Use semantic buttons for clickable controls.
-   Add accessible labels/`aria-label` values to icon-only buttons.
-   Support keyboard focus and visible focus states.
-   Close the More options menu on outside click and Escape.
-   Do not rely on color alone to communicate purpose.
-   Ensure click targets are comfortably sized.

## 15. Acceptance criteria

Phase 1 is complete only when:

1.  The UI visually resembles the supplied Runable Companion screenshot.
2.  The panel fills its available height.
3.  Header shows the R tile, product name, plus button, and ellipsis.
4.  More options includes every requested item in the correct order.
5.  Welcome section shows **Good afternoon, Sunil** and **How can
    Runable help you today?**
6.  Four action cards appear in one row with correct labels and accent
    icon colors.
7.  Bottom composer includes the placeholder, plus, Agent, Auto, and
    microphone controls.
8.  More options opens/closes correctly.
9.  Dropdowns and buttons have simple local demo interactions.
10. No real backend, AI, page reading, summarization, context menu, or
    shortcut is implemented.
11. Code is componentized and follows a maintainable folder structure.
12. Production build succeeds and the extension can be loaded as an
    unpacked Chromium extension.

## 16. Implementation workflow

Work in this order:

1.  Inspect the existing project before changing files. If none exists,
    scaffold with Vite.
2.  Set up Manifest V3 configuration.
3.  Build the panel shell and global design tokens.
4.  Implement header and More options menu.
5.  Implement welcome section.
6.  Implement four quick-action cards.
7.  Implement bottom chat composer.
8.  Add local demo interactions and responsive behavior.
9.  Compare against the supplied screenshot and refine spacing,
    typography, dimensions, colors, and shadows.
10. Run the production build and fix errors.

Do not move to Phase 2 until Phase 1 is complete and reviewed.

## 17. Required final output

When finished, provide: - Complete source code and all required files. -
Explanation of the folder structure. - Exact commands to install
dependencies and run the development preview. - Exact command to build
the extension. - Step-by-step instructions to load the unpacked
extension in Chrome. - A checklist confirming the Phase 1 acceptance
criteria. - Any limitations preventing a perfect match to the reference.

**Important:** Do not merely describe the design or create a static
mockup image. Build the actual React-based extension UI. Prioritize
visual accuracy, reusable code, clean CSS, and a working Phase 1 demo.
