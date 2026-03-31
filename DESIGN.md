# Design System: Minimal CRM Multi-Entity Data Table Screen

## 0. Design Rationale
- **App Type:** B2B CRM data management interface focused on tabular record browsing, filtering, sorting, and bulk actions across multiple entity types such as contacts, companies, deals, tasks, and notes.
- **Target Users:** Sales operations staff, account managers, CRM administrators, and customer-facing teams using desktop browsers during work hours to scan, edit, and manage structured business records quickly.
- **Design Direction:** Strictly minimal, utilitarian, and information-dense. Users of a CRM table screen need fast scanning, low visual noise, clear hierarchy, and reliable interaction patterns across many data types, so the interface should prioritize typography, spacing consistency, and restrained color usage over brand expression. The aesthetic is modern enterprise SaaS: clean white surfaces, crisp gray structure, one strong action color, and subtle feedback states that support high-frequency use without fatigue.
- **Assumptions Made:** User did not specify branding, so a neutral blue primary was selected because it communicates trust and works well in enterprise software. User did not specify device priority, so this system is designed desktop-first for a 1440px viewport with responsive fallback to tablet and mobile. User asked for a data table screen usable across entity types, so the system emphasizes reusable patterns such as sticky table headers, filter bars, status badges, row selection, and bulk actions instead of entity-specific visual treatments. User did not request a full application shell, so the navigation is scoped to a top bar with entity tabs suitable for switching between modules. User requested minimalism, so decorative color and large shadows are intentionally avoided.

## 1. Color Palette

### Brand / Primary
- **CRM Blue** `#2563EB` — Primary action color. Use for primary buttons, active controls, selected states, links, and focus accents.
- **CRM Blue Dark** `#1D4ED8` — Pressed and hover state for primary actions. Use only for interactive state changes on primary elements.

### Neutrals
- **App Background** `#F8FAFC` — Main application background. Use behind table containers, page chrome, and large layout regions.
- **Surface White** `#FFFFFF` — Primary surface color. Use for cards, tables, inputs, dropdowns, and modals.
- **Border Gray** `#E2E8F0` — Standard border and divider color. Use for table row separators, input borders, container outlines, and sticky header separation.
- **Text Secondary** `#64748B` — Secondary text color. Use for helper text, inactive navigation labels, metadata, placeholders, and less prominent values.
- **Text Primary** `#0F172A` — Primary text color. Use for headings, table values, labels, and default UI text.

### Semantic / Feedback
- **Success Green** `#16A34A` — Success state color. Use for positive statuses, confirmation icons, and success alerts only.
- **Warning Amber** `#D97706` — Warning state color. Use for caution statuses, warning alerts, and attention markers only.
- **Error Red** `#DC2626` — Error state color. Use for destructive actions, invalid states, and error alerts only.
- **Info Sky** `#0284C7` — Informational state color. Use for info alerts, informational badges, and neutral record statuses only.

### Accent (optional)
- **Selection Blue Tint** `#DBEAFE` — Selection and active row background. Use for selected rows, active filters, and subtle state emphasis without replacing the primary color.
- **Neutral Tint** `#F1F5F9` — Subtle neutral highlight. Use for header backgrounds, hovered rows, secondary button backgrounds, and grouped controls.

**Rules the downstream agent must follow:**
- Background and surface colors must have a contrast ratio ≥ 1.1:1 to be visually distinguishable.
- Text on any background must meet WCAG AA (≥ 4.5:1 for body text, ≥ 3:1 for large text/headings).
- Primary action color must have ≥ 4.5:1 contrast against its expected background (typically white or the surface color).
- Never use semantic colors (success/error/warning) for decoration.

## 2. Typography

### Font Stack
- **Display / Headings:** Inter — Chosen for crisp, modern, highly legible letterforms that match enterprise software and hold up well in dense interfaces.
- **Body / UI:** Inter — Using one type family across the system ensures maximum consistency in tables, filters, forms, and navigation where compact readability matters more than personality.
- **Monospace (if applicable):** JetBrains Mono — Use for record IDs, raw values, imported field keys, and aligned numeric/code-like content.

### Type Scale

| Level | Font | Weight | Size | Line Height | Letter Spacing | Usage |
|-------|------|--------|------|-------------|----------------|-------|
| Display XL | Inter | 700 | 32px | 1.2 | -0.02em | Screen titles |
| Heading 1 | Inter | 700 | 24px | 1.25 | -0.02em | Primary page section headers |
| Heading 2 | Inter | 600 | 20px | 1.3 | -0.01em | Table block titles, drawer headers |
| Heading 3 | Inter | 600 | 16px | 1.4 | -0.01em | Filter group headers, card titles |
| Body Large | Inter | 400 | 16px | 1.5 | 0em | Prominent body text, toolbar content |
| Body | Inter | 400 | 14px | 1.5 | 0em | Default UI text, table cells, inputs |
| Body Small | Inter | 400 | 12px | 1.45 | 0em | Secondary metadata, compact helper text |
| Label | Inter | 600 | 12px | 1.4 | 0.02em | Form labels, table headers, badge text |
| Caption | Inter | 500 | 12px | 1.35 | 0.01em | Timestamps, status metadata, row subtext |

**Rules:**
- Minimum body text size: 14px.
- Minimum caption/small text size: 12px.
- Heading weights must be visually distinct from body (use semi-bold 600 or bold 700 minimum for headings if the body is regular 400).

## 3. Spacing & Sizing Scale

- **Base unit:** 4px
- **Scale:** 4px (2xs), 8px (xs), 12px (sm), 16px (md), 20px (md-lg), 24px (lg), 32px (xl), 40px (2xl), 48px (3xl), 64px (4xl), 80px (5xl), 96px (6xl)

### Application Rules
- **Component internal padding:** md (16px) horizontal, sm (12px) vertical for standard controls; lg (24px) for cards and table containers
- **Space between related elements:** xs (8px) for icon-to-text and label-to-helper; sm (12px) for stacked control relationships
- **Space between distinct sections:** xl (32px)
- **Page margin / max-width:** max-width: 1440px, centered with lg (24px) side padding on desktop and md (16px) side padding on tablet/mobile

## 4. Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| none | 0px | Sharp-edged table grids and internal dividers |
| sm | 6px | Inputs, compact chips, small badges |
| md | 8px | Buttons, dropdowns, cards, filter controls |
| lg | 12px | Table container, modals, side panels |
| xl | 16px | Large panels and prominent container groupings |
| full | 9999px | Pills, avatars, circular elements |

## 5. Elevation & Shadows

| Level | CSS Value | Usage |
|-------|-----------|-------|
| 0 (flat) | none | Default state, inline elements |
| 1 (low) | 0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 1px rgba(15, 23, 42, 0.04) | Cards at rest, subtle separation |
| 2 (medium) | 0 4px 8px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06) | Hovered cards, dropdowns |
| 3 (high) | 0 12px 24px rgba(15, 23, 42, 0.12), 0 4px 8px rgba(15, 23, 42, 0.08) | Modals, popovers, floating elements |
| 4 (highest) | 0 20px 40px rgba(15, 23, 42, 0.16), 0 8px 16px rgba(15, 23, 42, 0.10) | Toasts, notifications, command palettes |

## 6. Component Specifications

### Buttons

| Variant | Background | Text Color | Border | Border Radius | Padding | Font Size | Font Weight |
|---------|-----------|------------|--------|---------------|---------|-----------|-------------|
| Primary | #2563EB | #FFFFFF | none | md | 10px 16px | 14px | 600 |
| Secondary | #FFFFFF | #0F172A | 1px solid #E2E8F0 | md | 10px 16px | 14px | 600 |
| Ghost/Tertiary | transparent | #64748B | none | md | 10px 12px | 14px | 600 |
| Destructive | #DC2626 | #FFFFFF | none | md | 10px 16px | 14px | 600 |
| Disabled | #F1F5F9 | #94A3B8 | none | md | 10px 16px | 14px | 600 |

**Button States:**
- **Hover:** Primary background changes to `#1D4ED8`; Secondary background changes to `#F1F5F9`; Ghost background changes to `#F1F5F9` and text to `#0F172A`; Destructive background darkens to `#B91C1C`; elevate to shadow level 1; transition 150ms ease-out
- **Active/Pressed:** Remove shadow, apply `transform: scale(0.98)`; Primary uses `#1E40AF`; Secondary background `#E2E8F0`; Ghost background `#E2E8F0`; Destructive background `#991B1B`
- **Focus:** `outline: 2px solid rgba(37, 99, 235, 0.35); outline-offset: 2px`
- **Disabled:** No hover effects, `cursor: not-allowed`, no transform, no shadow

### Inputs & Form Controls

- **Default:** background `#FFFFFF`, border `1px solid #E2E8F0`, border-radius `sm`, padding `10px 12px`, font-size `14px`
- **Placeholder text:** color `#64748B`, font-style `normal`
- **Focus:** border-color `#2563EB`, box-shadow `0 0 0 3px rgba(37, 99, 235, 0.15)`, outline `none`
- **Error:** border-color `#DC2626`, helper text color `#DC2626`, optional icon using error red at 16px
- **Disabled:** background `#F1F5F9`, text color `#64748B`, border color `#E2E8F0`
- **Label:** font-size `12px`, weight `600`, color `#0F172A`, margin-bottom `xs (8px)`
- **Helper text:** font-size `12px`, color `#64748B`, margin-top `xs (8px)`

Additional form control rules for this CRM table screen:
- Standard input height: `40px`
- Compact filter chip button height: `32px`
- Select control uses right-aligned chevron icon at 16px with `color: #64748B`
- Checkbox size: `16px x 16px`, border `1px solid #E2E8F0`, checked background `#2563EB`, checkmark `#FFFFFF`
- Search input left icon spacing: `12px` from left edge, text starts after `36px`

### Cards / Containers

- **Background:** `#FFFFFF`
- **Border:** `1px solid #E2E8F0`
- **Border radius:** `lg`
- **Shadow:** 1 (low)
- **Padding:** `lg (24px)`
- **Hover (if interactive):** Border remains `#E2E8F0`, shadow changes to level 2, transform `translateY(-1px)`, transition 150ms ease-out

Primary table container rules:
- Outer container padding: `0`
- Toolbar padding: `16px 24px`
- Table header row padding: handled at cell level
- Sticky top toolbar and sticky table header allowed on scroll

### Navigation

- **Style:** top bar with horizontal entity tabs directly beneath the app header
- **Background:** `#FFFFFF`
- **Active item:** 2px bottom border in `#2563EB`, text color `#0F172A`, font-weight `600`, background `transparent`
- **Inactive item:** text color `#64748B`, font-size `14px`, weight `500`
- **Hover:** text color changes to `#0F172A`, background `#F8FAFC`, border-radius `6px` for non-active tabs

Top navigation dimensions:
- Header height: `64px`
- Entity tab bar height: `48px`
- Horizontal tab padding: `0 16px`
- Gap between tabs: `8px`

### Tables (if relevant to app type)

- **Header row:** background `#F8FAFC`, text color `#64748B`, font-weight `600`, text-transform `none`
- **Body row:** background `#FFFFFF`, text color `#0F172A`
- **Alternating rows:** no
- **Row hover:** background `#F8FAFC`
- **Cell padding:** `12px 16px`
- **Border:** `1px bottom border #E2E8F0 on each row, no vertical borders`

Detailed table rules:
- Table font size: `14px`
- Header font size: `12px`
- Header sticky position: `top: 0`
- Header z-index: `2`
- Header height: `44px`
- Body row minimum height: `48px`
- Selected row background: `#DBEAFE`
- Selected row left indicator: `3px solid #2563EB`
- Sortable header hover background: `#F1F5F9`
- Numeric cells align right
- Text cells align left
- Checkbox selection column width: `44px`
- Actions column width: `56px`
- Truncation: single-line ellipsis for primary cells; secondary metadata can wrap to 2 lines max
- Bulk action bar: appears above table, background `#EFF6FF`, border-bottom `1px solid #BFDBFE`, padding `12px 24px`

### Badges / Status Indicators

| Variant | Background | Text Color | Border Radius | Padding | Font Size |
|---------|-----------|------------|---------------|---------|-----------|
| Default | #F1F5F9 | #475569 | full | 4px 8px | 12px |
| Success | #DCFCE7 | #166534 | full | 4px 8px | 12px |
| Warning | #FEF3C7 | #92400E | full | 4px 8px | 12px |
| Error | #FEE2E2 | #991B1B | full | 4px 8px | 12px |

Additional badge rules:
- Font weight: `600`
- Line height: `1.35`
- Status icon optional at `12px`, gap `4px`
- Use badges for record state fields only, not decorative labels

### Modals / Dialogs (if relevant)

- **Overlay:** `rgba(15, 23, 42, 0.48)`
- **Container:** width `640px`, max-width `calc(100vw - 32px)`, padding `24px`, border-radius `lg`, shadow `3 (high)`
- **Header:** font level `Heading 2`, border-bottom `1px solid #E2E8F0`
- **Close button:** top-right aligned within header area, 32px square ghost button with 16px icon, border-radius `sm`

Modal layout specifics:
- Header padding bottom: `16px`
- Body padding top: `16px`
- Footer margin top: `24px`
- Footer actions aligned right with `8px` gap

### Alerts / Notifications (if relevant)

- **Structure:** border-left accent `4px solid`, border-radius `md`, padding `12px 16px`
- **Variants:** info, success, warning, error (each with specific background tint hex and accent/icon color hex)

Alert variants:
- **Info:** background `#F0F9FF`, accent/icon `#0284C7`, text `#0C4A6E`
- **Success:** background `#F0FDF4`, accent/icon `#16A34A`, text `#166534`
- **Warning:** background `#FFFBEB`, accent/icon `#D97706`, text `#92400E`
- **Error:** background `#FEF2F2`, accent/icon `#DC2626`, text `#991B1B`

## 7. Iconography

- **Source:** Lucide React
- **Default size:** 16px
- **Stroke width (if applicable):** 1.75
- **Color behavior:** Inherit text color via `currentColor`. Use semantic colors only for status icons and alerts. Toolbar and table action icons use `#64748B` by default and `#0F172A` on hover.

## 8. Layout & Grid

- **Max content width:** 1440px
- **Grid system:** 12-column grid, 24px gutters
- **Primary layout pattern:** Fixed top app header at 64px, entity tab bar beneath at 48px, then page content area with a compact page toolbar and a large table container. The table screen uses a single primary column with optional right-side detail drawer overlay for row inspection or editing.
- **Responsive breakpoints:**
  - Desktop: ≥1280px
  - Tablet: 768px – 1279px
  - Mobile: <768px
- **Responsive behavior notes:** On tablet, toolbar actions collapse into a “More” menu and low-priority columns are hidden based on importance. On mobile, the top tab bar becomes horizontally scrollable, the table becomes a stacked card-list representation, and row actions move into a kebab menu. Sticky header remains on desktop and tablet only. Filter groups wrap to multiple lines below 1024px.

## 9. Motion & Transitions

- **Default transition:** 150ms ease-out
- **Enter/appear animations:** 200ms cubic-bezier(0.16, 1, 0.3, 1)
- **Exit animations:** 150ms ease-in
- **Hover transitions:** background-color, border-color, box-shadow, transform — 150ms ease-out
- **Reduced motion:** Respect `prefers-reduced-motion: reduce`; remove all transforms and set enter/exit animation durations to 0ms. Keep color transitions at 100ms linear.

## 10. Accessibility Checklist

- [ ] All text meets WCAG AA contrast ratios against its background
- [ ] Focus indicators are visible on all interactive elements (never use outline: none without replacement)
- [ ] Interactive elements have minimum 44x44px touch target
- [ ] Color is never the sole indicator of state (pair with icons, text, or borders)
- [ ] Form inputs have visible labels (not placeholder-only)
- [ ] Error states include descriptive text, not just color change