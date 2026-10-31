# Runable Companion — More Options Pages UI Styling Prompt
## Reference-Matched UI for Artifacts, Plugins, Scheduled Tasks, Notetaker, Settings, and Account

> **How to use this prompt:** Run your coding agent from the root of the existing Runable Companion project. Provide the six UI reference screenshots together with this prompt. Also provide the existing Phase 1, Phase 2/3, and Phase 4 prompt files as project context if available.
>
> This is a **new, separate UI styling prompt**. Do not edit, replace, rename, or overwrite any earlier `.md` prompt file.

---

## Role

Act as a senior React.js UI engineer and product designer experienced in polished browser-extension interfaces.

Refine the visual design and responsive layouts of these existing Runable Companion pages so they closely follow the supplied screenshots:

1. Artifacts
2. Plugins
3. Scheduled tasks
4. Notetaker
5. Settings
6. Account

The supplied screenshots are the primary visual references. Study them carefully before making changes.

**This task is about UI styling, layout accuracy, responsive behavior, and visual consistency. It is not a request to rebuild the extension or implement real Runable services.**

## 1. Inspect the existing project before editing

Inspect the complete project and understand how the six pages are currently implemented. Review:

- `package.json`, installed dependencies, and Tailwind configuration.
- `manifest.json` and the extension entry points.
- React entry points and current page/view navigation.
- Existing More options menu and its click behavior.
- Existing Artifacts, Plugins, Scheduled tasks, Notetaker, Settings, and Account components.
- Global CSS, CSS variables, typography, colors, spacing, borders, shadows, and radii.
- Existing dummy data, local interaction handlers, and responsive behavior.

Before editing, create a short plan identifying the components and styles that need to change.

### Preservation rules

- Do not scaffold a new React project or replace the current application structure.
- Do not rewrite the extension navigation system.
- Do not remove working functionality from Phases 1, 2, 3, or 4.
- Do not change the keyboard shortcut, context-menu behavior, page-summary workflow, conversation UI, or chat composer.
- Do not create duplicate versions of existing pages.
- Do not move files just to match a suggested folder structure.
- Make focused changes to the existing components.

## 2. Technology and styling requirements

Continue using the existing stack:

- React.js with JavaScript and JSX.
- Vite.
- Chrome Extension Manifest V3.
- Tailwind CSS as the primary styling system.
- `lucide-react` for icons.
- Existing free/open-source dependencies only.

Do not introduce TypeScript if the project currently uses JavaScript. Do not add paid UI libraries, paid icon packs, external icon services, external image services, a backend, a database, or real Runable/third-party integrations.

Use the current Tailwind setup. Do not replace its configuration unnecessarily.

### Shared visual direction

All six pages should feel like parts of the same Runable product while retaining their page-specific layouts:

- Warm white/off-white backgrounds.
- Dark brown/near-black primary text.
- Muted warm-gray secondary text.
- Very light beige search fields and selected filter surfaces.
- Thin, subtle neutral borders.
- Soft rounded cards and controls.
- Minimal shadows.
- Clear typography hierarchy.
- Consistent icon stroke weight and sizing.
- Comfortable spacing without making the side-panel UI feel crowded.

Do not turn every page into a generic dashboard. Follow the individual screenshot layouts below.

### Design tokens

Inspect the Phase 1 home screen and reuse its actual design tokens. If suitable tokens do not exist, define a small shared set consistent with the current design. Suggested direction (adapt to existing values):

| UI element | Suggested direction |
|---|---|
| Main background | Warm off-white, around `#FFFEFC` |
| Primary text | Deep warm charcoal, around `#211A15` |
| Secondary text | Muted warm gray/brown, around `#776B61` |
| Subtle surface | Light warm gray, around `#F7F4F1` |
| Selected chip | Soft beige, around `#F1EBE5` |
| Border | Light warm gray, around `#EDE8E3` |
| Primary button | Deep brown/near-black with white text |
| Card radius | Rounded-xl to rounded-2xl as appropriate |
| Search radius | Rounded pill-like corners |
| Shadow | Very subtle; avoid heavy elevation |

These are visual references, not mandatory literal values. Existing Phase 1 tokens take priority when they already match.

### Reusable components and icons

Reuse or create small shared components where useful: `PageHeader`, `SearchField`, `FilterChip`, `PrimaryButton`, `SecondaryButton`, `EmptyState`, `SectionHeading`, `IntegrationCard`, `SettingsRow`, and `AccountMenuRow`. Avoid unnecessary abstraction.

Use `lucide-react` icons such as `Search`, `ListFilter`, `SlidersHorizontal`, `Archive`, `Clock`, `PlusCircle`, `Plus`, `Settings`, `CircleUserRound`, `Wallet`, `Coins`, `Headset`, `SunMoon`, `LogOut`, `ExternalLink`, `X`, and `Menu`.

Do not use emoji as interface icons. For recognizable provider logos, use an existing local asset if available. Otherwise use a simple local placeholder or text wordmark. Do not fetch logos from random external URLs.

---

## 3. Page 1 — Artifacts

### Reference structure

Match the supplied Artifacts screenshot. The page contains a left-aligned heading and subtitle, a full-width search field, a horizontal category-filter row, and a spacious centered empty state.

### Heading and description

Heading: **Artifacts**

Subtitle: “Reports, slides, sheets, sites, and media Runable has made for you.”

- Align both to the left.
- Use a medium-large, dark heading with a clear weight.
- Use muted secondary text for the subtitle.
- Allow natural wrapping on narrow widths.
- Keep the heading area compact.

### Search field

Placeholder: **Search artifacts**

- Full width within the page padding.
- Search icon on the left.
- Warm light-gray/beige surface, subtle border, rounded pill-like corners.
- Comfortable horizontal padding and readable input text.

### Category chips

Show: **All Artifacts**, **Images**, **Videos**, **Websites**, plus any other categories already present in the app.

- All Artifacts is selected by default.
- Selected chip has a soft beige fill and subtle border.
- Unselected chips use an off-white surface and light border.
- Use rounded pill shapes and consistent gaps.
- Keep the row horizontally scrollable when the chips do not fit.
- Do not allow the entire page to scroll horizontally.

### Empty state

When no artifacts exist, center this content in the remaining page area:

- Outlined archive/inbox-style icon.
- Heading: **Your artifacts will live here**
- Description: **Images, videos, websites, slides, and files from your chats will appear here.**
- Dark primary action: **Create artifact**, with a plus-circle icon.

Center the content horizontally and position it comfortably in the middle portion of the available area, not immediately below the filters. Use a dark warm outline icon, dark heading, muted centered description, and a compact dark rounded button with white text. Keep balanced vertical spacing.

### Existing behavior

Preserve existing dummy artifact records, search, category filters, preview/detail behavior, and local demo actions. Do not add real file generation or upload functionality as part of this styling task.

---

## 4. Page 2 — Plugins

### Reference structure

Match the supplied Plugins screenshot. It is denser than Artifacts and contains:

1. Top row: circular menu button on the left and dark **Add Custom Plugin** button on the right.
2. Tabs: Plugins, Workflows, Skills.
3. Full-width search field.
4. Filter chips: Discover, Connected, Included with Runable, plus a filter icon button.
5. Workspaces section with integration cards.
6. Social section with View all and compact integration items.

Do not simplify this into a generic two-column dashboard.

### Top row and tabs

- Menu button: circular, outlined, with a menu/list icon.
- Add Custom Plugin: dark rounded button with white text.
- Align controls vertically and keep them on one row where possible.
- Preserve existing menu behavior.
- Below it, show text tabs **Plugins**, **Workflows**, **Skills**.
- Plugins is selected by default with darker text and a thin underline.
- Other tabs use muted text. Do not style these as pills.

### Search and filters

Search placeholder: **Search**. Use the shared full-width search style with a search icon, warm light-gray surface, rounded corners, and subtle border.

Filters: **Discover**, **Connected**, **Included with Runable**, and a circular filter icon button.

- Discover is selected by default.
- Selected chip has a light beige fill; others have a light border and off-white surface.
- Use pill shapes and consistent gaps.
- Allow horizontal scrolling in the filter row on narrow panels.
- Keep the filter icon visually separate at the right when possible.
- Do not clip labels without a way to scroll.

### Workspaces section

Heading: **Workspaces**

Show these cards:

**Google**
- Google logo/icon treatment at upper-left.
- Connect button toward upper-right.
- Description: “Connect once — Gmail, Drive, Docs, Sheets, Calendar and more.”

**Microsoft**
- Microsoft logo/icon treatment at upper-left.
- Connect button toward upper-right.
- Description: “Connect once — Outlook, Calendar, OneDrive and Excel.”

Card styling:

- Stack full-width cards vertically at normal side-panel widths.
- White/off-white surface, thin warm-gray border, large rounded corners.
- Comfortable internal padding.
- Logo in a small rounded-square tile with subtle border/background.
- Connect button has a light surface, thin border, and dark text.
- Title uses medium-sized dark text; description uses muted text and comfortable line height.
- Keep consistent vertical spacing.
- Use a multi-column grid only at widths where it genuinely improves readability.

### Social section

Show **Social**, a **View all** action on the right, and small previous/next circular arrow controls if the existing app supports a carousel.

Show existing social integration items, including LinkedIn if already in the demo data. Each item has a service icon/logo tile, service name, and add/plus action on the right.

Keep the row compact and responsive. Preserve local Add/Connect behavior. Do not add real OAuth or third-party authentication.

### Existing interactions

Preserve tab selection, Discover/Connected filters, search, Connect/Connected states, Add Custom Plugin's existing demo behavior, and filter-control behavior. All provider connections must remain local demo interactions.

---

## 5. Page 3 — Scheduled tasks

### Reference structure

Match the supplied Scheduled tasks screenshot. It contains:

1. Top row with circular menu button and dark Create dropdown button.
2. Heading and subtitle.
3. Search field.
4. Status filter chips.
5. Centered empty state.
6. Divider.
7. Suggestions list.

### Top row

- Circular outlined menu button on the left.
- Dark rounded **Create** button on the right with a small downward chevron.
- Keep the row compact and vertically aligned.
- Preserve existing dropdown behavior; never open it automatically.

### Heading and search

Heading: **Scheduled tasks**

Subtitle: “Ask Runable to schedule tasks, set reminders, or monitor for updates.”

Search placeholder: **Search scheduled tasks**

Align heading and subtitle to the left. Use dark heading text, muted subtitle, and natural wrapping. Style the search field like the Artifacts search field.

### Status chips

Show **All**, **Active**, **Paused**, **Completed**.

- All selected by default.
- Selected chip has a light beige fill.
- Others use off-white surfaces and subtle borders.
- Use pill shapes and consistent gaps.
- Allow horizontal scrolling if required.

### Empty state

Center:

- Outlined clock icon.
- Heading: **No scheduled tasks yet**
- Description: **Schedule a task and Runable will run it for you automatically.**
- Secondary outlined button: **New Task**

Use a dark warm-gray icon and heading, muted centered description, and a light outlined rounded button. Keep generous but controlled vertical spacing. Do not use the dark primary style for this secondary action. Avoid pushing the suggestions section unnecessarily far below the viewport.

### Suggestions section

Add a thin horizontal divider, then the heading **Suggestions**.

Show clean list rows (not large cards) for:

**Daily brief**
- Bell icon.
- Cadence: **Weekdays at 8:00 AM**
- Description: “Start each weekday with a summary of your calendar, unread email, and priorities.”

**Weekly review**
- Calendar/clipboard icon.
- Cadence: **Weekly at 4:00 PM**
- Description: “Turn your recent work into a concise weekly update.”

Place each icon in a narrow left column. Put title and cadence on one line when possible; allow cadence to wrap on narrow panels. Put the description below in muted text. Use subtle accent colors for icons and consistent vertical spacing.

### Existing behavior

Preserve dummy task records, local status filters, pause/activate toggles, and existing local Create/New Task interactions. Do not implement real scheduling, background monitoring, notifications, or remote execution.

---

## 6. Page 4 — Notetaker

### Reference structure

Match the supplied Notetaker screenshot. This is a product-introduction/landing-style page, not a conventional list page. It contains:

1. Top row with circular menu button and settings icon button.
2. Centered Notetaker icon tile.
3. Large centered heading and description.
4. Dark Connect Calendar button.
5. Large rounded preview area.
6. Soft gradient/trusted-by section near the bottom.

### Top row and hero

- Circular outlined menu button at upper-left.
- Circular outlined settings button at upper-right.
- Keep the row quiet and compact; preserve existing navigation.
- Center a small rounded-square white/warm-white icon tile with a Notetaker/meeting outline icon, subtle border, and soft shadow.

Heading: **Notetaker**

Description: “Notetaker joins your calls and turns them into notes, summaries, and action items. Automatically.”

Center-align both. Use a large clean heading and readable body text with comfortable line height. Constrain the text width so it wraps into balanced lines.

### Connect Calendar button

Label: **Connect Calendar**

- Dark/black rounded pill button with white text.
- Center it beneath the description.
- Make it prominent but not full-width unless the viewport requires it.
- Preserve only the existing local demo interaction. Do not connect to a real calendar provider or request OAuth permissions.

### Preview area

Below the button, show a large responsive preview container with rounded corners and a dark/black outer frame.

- Reuse an existing local preview asset if one exists.
- If there is no asset, create a polished static mock preview using local HTML/CSS and dummy UI elements.
- Do not load remote images or videos.
- Do not add real call recording or microphone capture.
- Do not pretend a meeting is active.
- Keep the preview within the content width and avoid cropping important mock UI at narrow widths.
- Any decorative playback controls must be visual-only and must not pretend to control real media.

### Trusted-by section

Below the preview, create a subtle blue-to-cyan-to-green gradient transition restricted to the lower trusted-by area.

- Center the label **Trusted by**.
- Show a responsive horizontal row of text/logo treatments such as Google, Microsoft, Cisco, and Vercel only if they are in the supplied reference or existing demo.
- Prefer local text wordmarks or existing local assets; do not download external logos.
- Wrap or horizontally scroll the row when necessary.
- Keep the marks readable against the gradient.

Preserve existing local Notetaker navigation and settings behavior. Do not add microphone permissions, real calendar OAuth, recording, or transcription.

---

## 7. Page 5 — Settings

### Reference structure

Match the supplied Settings screenshot. This is a compact navigation drawer/panel, not a dashboard.

It contains a **Settings** header, close `X` button, grouped section labels, and full-width navigation rows with icons, labels, and trailing chevrons/arrows.

### Panel and header

- Warm off-white/beige surface.
- Compact header row with **Settings** aligned left and close icon button at upper-right.
- Keep content left-aligned.
- Add a subtle divider only if it matches the existing application style.

### Group structure

Use this order from the reference:

**Account**
- Account
- Billing
- Token Usage

**Customize**
- Personalization
- Plugins
- Agent Skills

**Other**
- Claw
- Flow
- Notetaker
- MCP

Preserve additional existing Settings rows if the application already has them. Do not remove current destinations.

### Row styling

Each row contains:

- Small outline icon on the left.
- Label beside it.
- Trailing chevron/right arrow when appropriate.
- Consistent row height and horizontal padding.
- Clear vertical alignment.

The **Account** row is selected in the supplied reference. Give it a soft beige rounded highlight spanning nearly the full row width. Keep icon and text dark and readable. Do not use a saturated accent color.

Unselected rows should have a transparent/matching background, muted dark text, subtle hover/focus surface, and lighter trailing arrows.

### Group labels and scrolling

- Group labels are small and muted, not bold or large.
- Use enough space above each group to distinguish it.
- Maintain consistent spacing between groups.
- Content scrolls vertically when it exceeds the available height.
- Keep the header visible if the current layout supports a sticky header.
- Do not create horizontal scrolling.
- Preserve close and row-navigation behavior.
- Do not invent functional Billing, Token Usage, Personalization, Agent Skills, Claw, Flow, or MCP pages if they do not already exist; retain the existing local placeholder/navigation behavior.

---

## 8. Page 6 — Account

### Reference structure

Match the supplied Account screenshot. This is a compact profile/account menu, not a full account dashboard.

It contains:

1. Profile avatar, name, and email.
2. Credits card with balance.
3. Usage and Upgrade buttons.
4. Invite, Affiliate, Help, Appearance, and Settings rows.
5. A separated Log out action.

### Profile header

- Small circular avatar on the left.
- User name to the right, darker and slightly larger than the email.
- Email below the name in muted text.
- Keep avatar and text vertically aligned.
- Long email addresses must wrap or truncate safely without horizontal overflow.
- Use the existing dummy account data. Do not hardcode personal details from the screenshot if they are not already part of the demo data.

### Credits card

Use a soft neutral card below the profile row.

First row:
- Credits/wallet icon on the left.
- Label: **Credits**
- Existing dummy balance aligned right (for example, **0 left** only if that is already the demo value).

Second row:
- **Usage** secondary button.
- **Upgrade** dark primary button.

Design:
- Light warm-gray/beige surface with rounded corners and internal padding.
- Usage button has a light surface and subtle border.
- Upgrade button has a dark surface and white text.
- Buttons have matching heights and balanced widths.
- Keep them side by side when space allows; stack only at exceptionally narrow widths.

### Account menu rows

Show in this order:

1. Invite
2. Affiliate
3. Help
4. Appearance
5. Settings

Each row has a small outline icon on the left, label, and optional trailing information/action indicator.

Specific details:
- Invite may show a muted badge such as **Earn 20k credits** if that exists in the current demo data.
- Affiliate may show an external-link arrow.
- Help may show a right chevron.
- Appearance may show a right chevron.
- Settings uses a gear icon and preserves existing navigation.

Keep rows compact and consistently spaced. Use dark warm text and muted indicators. Do not place each row inside a large separate card.

### Log out row

At the bottom, separate the Log out action with a subtle horizontal divider.

- Logout/exit icon on the left.
- Label: **Log out**
- Restrained red/coral text and icon treatment.
- Keep the row distinct but not oversized.
- Preserve the existing local demo sign-out interaction.
- Do not implement real authentication or clear browser data.

Preserve existing local demo behavior for Usage, Upgrade, Invite, Affiliate, Help, Appearance, Settings, and Log out. Do not introduce real payment, referral, account, or authentication integrations.

---

## 9. Responsive behavior

The extension side-panel width can change. Do not design for one fixed width.

Test at:

- 320px
- 360px
- 400px
- 496px
- 520px
- 768px
- 1024px

Also test short and tall viewport heights.

### Responsive rules

- Use `w-full`, `max-w-full`, and `min-w-0` where appropriate.
- Use responsive padding and gaps.
- Use one-column layouts on narrow panels.
- Use multiple columns only when there is enough width.
- Use `flex-wrap` for action rows where needed.
- Use horizontal scrolling for filter chips and logo/carousel rows where specified.
- Keep page content vertically scrollable.
- Keep headers and fixed controls from overlapping scrollable content.
- Use `overflow-x-hidden` only to prevent accidental page overflow; never hide important content.
- Ensure long titles, emails, descriptions, and URLs wrap or truncate safely.
- Do not reduce font sizes excessively to force content to fit.
- Do not clip buttons or controls.
- Do not allow the page itself to scroll horizontally.

At short heights, allow content to scroll, keep important controls accessible, and avoid fixed vertical spacing that pushes actions off-screen. At tall heights, preserve balanced whitespace and avoid stretching cards unnaturally. Empty states should be centered within the available content region without hiding content below.

---

## 10. Navigation and interaction preservation

This is a styling task. Existing navigation and interactions must continue working.

Preserve:

- Opening each More options page from the existing menu.
- Back/return navigation.
- Existing menu close behavior.
- Existing tabs and filter selection.
- Existing search fields.
- Existing local Connect/Connected states.
- Existing scheduled-task states.
- Existing Account actions.
- Existing Settings row navigation.
- Existing Notetaker local demo behavior.

More options dropdown rules:

- Closed by default.
- Opens only when the user clicks its trigger.
- Clicking the trigger again closes it.
- Outside click closes it.
- Escape closes it.
- Navigating to a page closes it.
- Returning home must not open it automatically.

Do not change these rules while styling the pages.

---

## 11. Accessibility and implementation quality

- Use semantic `<button>` elements for actions.
- Give icon-only buttons accessible `aria-label` values.
- Provide visible keyboard focus states.
- Maintain sufficient text contrast.
- Ensure filter chips and tabs are keyboard accessible.
- Ensure horizontal chip rows can be navigated without a mouse.
- Use meaningful heading hierarchy.
- Avoid `dangerouslySetInnerHTML`.
- Avoid unnecessary inline styles and dependencies.
- Avoid duplicated CSS selectors and conflicting page-specific styles.
- Keep components readable and reusable.
- Do not put all six page implementations into one giant JSX component.

---

## 12. Implementation sequence

Work in this order:

1. Inspect the project, six page components, and shared design system.
2. Compare current pages against the supplied screenshots.
3. Identify reusable components and interactions that must be preserved.
4. Confirm the existing Tailwind configuration and CSS tokens.
5. Implement/refine shared search, filter chip, button, section heading, and row styles.
6. Restyle Artifacts.
7. Restyle Plugins.
8. Restyle Scheduled tasks.
9. Restyle Notetaker.
10. Restyle Settings.
11. Restyle Account.
12. Test all pages at the required widths and heights.
13. Verify existing interactions still work.
14. Run the production build and fix errors.
15. Compare the rendered UI against each screenshot and correct spacing, sizing, alignment, and wrapping.

Do not stop after applying generic Tailwind classes. The final result must be visually compared with the supplied references.

---

## 13. Visual acceptance checklist

### Artifacts
- [ ] Heading and subtitle match the reference hierarchy.
- [ ] Search field is full-width and styled consistently.
- [ ] Category chips have selected/unselected states.
- [ ] Filter row scrolls horizontally when needed.
- [ ] Empty-state icon is centered and balanced.
- [ ] Empty-state heading and description are centered.
- [ ] Create artifact button matches the dark primary style.
- [ ] No horizontal page overflow.

### Plugins
- [ ] Menu button and Add Custom Plugin button align correctly.
- [ ] Plugins/Workflows/Skills tabs show a clear active underline.
- [ ] Search field matches the shared style.
- [ ] Filter chips and filter icon align correctly.
- [ ] Workspace cards match the reference's stacked layout.
- [ ] Google and Microsoft card content wraps correctly.
- [ ] Connect buttons remain aligned and usable.
- [ ] Social section and View all action are present.
- [ ] Social integration items are responsive.
- [ ] All interactions remain local demo behavior.

### Scheduled tasks
- [ ] Top menu and Create dropdown match the reference.
- [ ] Heading and subtitle have the correct hierarchy.
- [ ] Search field matches the shared style.
- [ ] All/Active/Paused/Completed chips render correctly.
- [ ] Empty-state icon, heading, description, and New Task button are centered.
- [ ] Divider separates Suggestions.
- [ ] Daily brief and Weekly review rows have correct icon/text alignment.
- [ ] Suggestions wrap cleanly at narrow widths.
- [ ] Existing local task interactions still work.

### Notetaker
- [ ] Top menu and settings controls are aligned.
- [ ] Hero icon tile is centered.
- [ ] Heading and explanatory copy are centered.
- [ ] Connect Calendar button matches the dark pill style.
- [ ] Preview area has rounded corners and responsive proportions.
- [ ] Trusted-by gradient is restricted to the lower section.
- [ ] Wordmarks/logos remain readable and responsive.
- [ ] No real recording, calendar connection, or remote media is introduced.

### Settings
- [ ] Settings title and close button align correctly.
- [ ] Account, Customize, and Other group labels are styled consistently.
- [ ] Navigation rows have aligned icons and labels.
- [ ] Account selected state uses a soft beige highlight.
- [ ] Trailing arrows/chevrons are aligned.
- [ ] Vertical scrolling works when needed.
- [ ] Existing row navigation and close behavior remain intact.

### Account
- [ ] Avatar, name, and email align correctly.
- [ ] Credits card has the correct two-row structure.
- [ ] Usage and Upgrade buttons are aligned.
- [ ] Invite, Affiliate, Help, Appearance, and Settings rows are present.
- [ ] Optional badge and trailing indicators align correctly.
- [ ] Log out is separated by a divider and uses restrained red styling.
- [ ] Long email text does not overflow.
- [ ] Existing local demo actions remain intact.

### Global
- [ ] All six pages use the existing Runable design tokens.
- [ ] All six pages are responsive at the specified widths.
- [ ] Short and tall side-panel heights are tested.
- [ ] No clipped text, overlapping controls, or accidental horizontal scrolling.
- [ ] More options remains closed by default.
- [ ] Phase 1 home screen remains unchanged.
- [ ] Phase 2 Ask with Runable remains functional.
- [ ] Phase 3 keyboard shortcut remains functional.
- [ ] Phase 4 summarization and conversation UI remain functional.
- [ ] Production build succeeds.

---

## 14. Required final report from the coding agent

After completing the work, report:

1. A short summary of visual changes made to each of the six pages.
2. Files modified and any new files created.
3. Reusable components or design tokens added/updated.
4. Responsive widths and heights actually tested.
5. Production build result.
6. Acceptance criteria actually tested and passed.
7. Remaining visual differences or limitations.

Do not claim a screen was tested at a particular size unless it was actually tested.

---

## Final instruction

**Use the six supplied screenshots as page-specific visual references. Match their layout, spacing, typography, controls, and visual hierarchy as closely as practical while retaining the existing Runable Companion design language.**

This is a focused styling and responsive-layout update to the existing Artifacts, Plugins, Scheduled tasks, Notetaker, Settings, and Account pages.

Do not rebuild the extension. Do not overwrite earlier prompt files. Do not remove existing functionality. Do not add real backend integrations or external services. Preserve all working Phase 1–4 behavior.
