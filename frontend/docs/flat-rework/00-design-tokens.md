# 00 — Master Design Tokens (Flat, Sans-Only)

Source of truth for all phases. Features frozen; this file defines visuals only.
Palette: `#EEEDE9` · `#C7BBAB` · `#6B7881` · `#232D36` · `#97764D` + status colors.

## 1. Colors

### Core (new canonical vars)

```css
--color-canvas: #EEEDE9;        /* page bg */
--color-surface: #FFFFFF;       /* card/header/modal/input */
--color-surface-muted: #F2F0EB; /* zebra row / subtle tint (white + C7BBAB 15%) */
--color-line: #C7BBAB;          /* all borders/dividers */
--color-ink: #232D36;           /* primary text, headings, sidebar fill, primary btn */
--color-slate: #6B7881;         /* secondary text, icons, placeholders, th */
--color-bronze: #97764D;        /* accent: active, links, focus, KPI */
--color-bronze-dark: #7D6240;   /* bronze hover */
--color-ink-hover: #161D24;     /* primary btn hover */
```

### Text mapping

| Use | Color |
|---|---|
| Heading / primary text | `#232D36` |
| Body | `#232D36` |
| Secondary / meta | `#6B7881` |
| Muted / placeholder | `#6B7881` @ 80% |
| On dark (`#232D36` bg) | `#FFFFFF` |
| Links | `#97764D`, hover `#7D6240`, underline on hover |

### Status (flat fills, text must pass 4.5:1)

| Status | Fill (bg) | Text | Border |
|---|---|---|---|
| Success | `#E3EDE4` | `#2F5D37` | `#C7BBAB` or `#2F5D37` @ 30% |
| Warning | `#F0E7D3` | `#7A5A1E` | same pattern |
| Danger/Error | `#F3DEDE` | `#962222` | same pattern |
| Info | `#DDE5EC` | `#2F4A5E` | same pattern |
| Neutral/Default | `#EEEDE9` | `#232D36` | `#C7BBAB` |

Old vars `--color-success #4F8A5B`, `--color-warning #C58A3A`, `--color-error #C85C5C`, `--color-info #5C7FA3` remain as **border/icon accents only**, never white-text-on-fill (contrast fail).

### Removed (do not use)

`--color-bg-neumorphic`, `--color-surface-raised/recessed/neumorphic`, `--color-brand-*`, `--color-brown-*`, `--color-cream-*`, `--color-taupe-*`, `--color-blue-*`, `--color-primary-*`, `--shadow-neumo-*`, `--radius-neumo`, `--color-green/yellow/red/blue-light`.

## 2. Typography (sans-only)

```css
--font-family-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
/* --font-family-display removed — headings use sans 700 */
```

- Load Inter in `index.html` (replace Poppins/Open Sans).
- Headings: sans, `#232D36`, 700 (h1 24 / h2 20 / h3 18).
- Body 14/1.5 `#232D36`; caption 12 `#6B7881`; button 14/600.
- No serif anywhere (PMS + public + auth).

## 3. Shape / border / shadow / motion

```css
--radius-sm: 4px;   /* badges, chips */
--radius-md: 8px;   /* cards, buttons, inputs, modals */
--radius-pill: 999px;
--border-default: 1px solid #C7BBAB;
--shadow-none: none;
--shadow-pop: 0 1px 2px rgba(35,45,54,.12); /* modal/dropdown only, + border */
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
```

- Card: `#FFFFFF` + `1px solid #C7BBAB` + `radius 8px` + no shadow.
- Input: `#FFFFFF`, `44px` height, `1px solid #C7BBAB`, radius `8px`, focus `2px solid #97764D` outline.
- Button heights: sm 36 / md 44 / lg 52. No `width:100%` default (auth card sets its own).
- Table wrapper: `overflow-x-auto`, border `1px solid #C7BBAB`, radius `8px`.

## 4. Tailwind mapping (`tailwind.config.ts`)

```ts
colors: {
  canvas: '#EEEDE9',
  surface: '#FFFFFF',
  'surface-muted': '#F2F0EB',
  line: '#C7BBAB',
  ink: '#232D36',
  slate: '#6B7881',
  bronze: { DEFAULT: '#97764D', dark: '#7D6240' },
  status: { success: {...}, warning: {...}, danger: {...}, info: {...} },
}
borderRadius: { sm: '4px', DEFAULT: '8px', md: '8px', lg: '8px', xl: '12px' }
boxShadow: { none: 'none', pop: '0 1px 2px rgba(35,45,54,.12)' }
fontFamily: { sans: ['Inter','system-ui',...] }
```

Keep legacy keys (`brand`, `neumo` shadows) **deleted**, not aliased — forces cleanup.

## 5. Component rules (applies to Phase 0 impl)

- **Button**: primary `#232D36`+white; secondary `#FFFFFF`+`#232D36` text + `1px #C7BBAB`; accent/bronze only for marketing CTA; outline bronze; danger `#962222`; disabled `#EEEDE9` + `#6B7881`. No shadows, no scale press.
- **Card**: white + line border + 8px. `hover` prop → border-color `#97764D`, no lift/shadow.
- **Badge**: 4px radius, `1px solid` border, flat fills from status table. No pill-shadow.
- **Table**: flat header, zebra, hover tint, `1px` row dividers `#C7BBAB @ 60%`.
- **Input/Select**: white, 44px, label always, error `#962222`.
- **Modal**: white, 8px, line border, `pop` shadow max, scrim `rgba(35,45,54,.45)`, close uses Lucide `X`.
- **Pagination**: 36–40px flat squares, active `#232D36`+white, inactive white+line border.
- **Loading**: spinner `#C7BBAB` track + `#97764D` top; skeleton `#EEEDE9` pulse; page bg `#EEEDE9`.
- **Empty/Error**: white + line border + 8px; error accent `#962222`; no emoji (use Lucide).
- **StatsCard**: white + line border, value `#232D36` (or bronze for hero KPI), label slate, icon slate/bronze.

## 6. Layout rules

- **PMS shell**: bg `#EEEDE9`; sidebar `#232D36` (white/slate-200 text, active item `#FFFFFF` 12% overlay + bronze left bar or bronze text); topbar `#FFFFFF` + bottom `1px #C7BBAB`; content max ~1200px, 20–24px padding; footer small slate.
- **Public/auth shell**: bg `#EEEDE9`; card `#FFFFFF` + line border + 8px; footer `#232D36` + white text.
