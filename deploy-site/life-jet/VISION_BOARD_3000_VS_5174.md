# Vision Board: localhost:3000 vs life-jet (5174)

## What runs where

| URL | App | Port |
|-----|-----|------|
| **http://localhost:3000/** | `vision-board/` (Vite + React) | 3000 |
| **http://localhost:5174/vision-board** | `deploy-site/life-jet` (Next.js) | 5174 |

---

## 1. Tech stack

| | localhost:3000 | life-jet 5174 |
|-|----------------|----------------|
| **Framework** | Vite + React + TypeScript | Next.js + React |
| **Styling** | Tailwind v4 (`@import "tailwindcss"`) | Tailwind + styled-jsx + `styles.css` (CSS vars) |
| **UI** | shadcn-style (Card, Button, Input, Progress, Badge, Tabs) | Custom life-jet components |
| **Icons** | Lucide React (Shield, Eye, Crosshair, etc.) | Emoji (👁, 🕐, ☀️) |
| **Motion** | Framer Motion (AnimatePresence, motion.div) | None |
| **Layout** | Single `LifeVisionBoard.tsx` (~850 lines) | `vision-board/page.js` + shared components |

---

## 2. Layout differences

### localhost:3000

- **Top/bottom**: Fixed gradient lines (emerald top, cyan bottom).
- **Header**: Shield icon + “LIFE VISION BOARD” + “Command Center // Private Ops” | **Operation Phoenix** box (EYES ONLY + mission) | Weather, B+, Clock in small cards.
- **Nav**: **Tabs** (TabsList + TabsTrigger) – Command, Health, $ Income, Achievements, etc. Icons + labels. Active = `bg-slate-700/50`, `text-sky-400`.
- **Main (Command tab)**:
  - `grid-cols-12`:
    - **Left `lg:col-span-8`**: Vision Matrix **card** → then **Active Operations** card (both in same column).
    - **Right `lg:col-span-4`**: **Daily Ops** card → **Quick Intel** card.
  - **Active Ops**: Inside main grid as a **card below** Vision Matrix, not a separate bar.

### life-jet 5174

- **Top/bottom**: No gradient lines.
- **Header**: Emoji 👁 + same text. Operation Phoenix as plain text. Weather/B+/Clock plain.
- **Nav**: Plain buttons, **no tabs** – all labels, no icons, no tab switching.
- **Main**:
  - `grid` **1fr | 320px** (left | right).
  - **Left**: Vision Matrix only.
  - **Right**: Daily Ops + Quick Intel.
  - **Bottom**: **Active Ops in a separate bottom bar** (full-width), not in main grid.

So: **3000** = 8+4 grid, Active Ops as **card** below Vision Matrix. **5174** = 2-col + **bottom bar** for Active Ops.

---

## 3. Styling differences

### localhost:3000

- **Body**: `background: linear-gradient(135deg, #0a1628, #1a2744, #0f1b2d)` (same as 5174).
- **Header**: `border-b border-cyan-500/20`, `bg-slate-900/90`, `backdrop-blur-md`.
- **Cards**: `bg-slate-800/50`, `border-cyan-500/20`, `backdrop-blur-sm`. Some use `card-glow` (box-shadow + hover lift).
- **Vision Matrix**:
  - `grid-cols-2 md:grid-cols-3`, `gap-3 md:gap-4`.
  - Each card: `aspect-[4/3]`, `rounded-lg`, `border-emerald-900/50`, hover `border-emerald-500/50`, `group-hover:scale-105`.
  - Overlay: `bg-gradient-to-t from-slate-950`.
  - Caption: Crosshair icon + `text-emerald-400`, `font-mono`, `tracking-wider`.
  - Label: `TARGET-01` style, `bg-slate-950/80`, `border-cyan-900/50`, top-left.
  - Delete: red button, `opacity-0 group-hover:opacity-100`.
- **Daily Ops**:
  - Progress: `Progress` component, `h-2`, `bg-slate-700`.
  - Input + Plus button, `border-emerald-900/50`, `bg-slate-800/50`.
  - Todo rows: `bg-slate-800/30` or `bg-emerald-900/20` when done, `border-emerald-900/30` / `border-slate-700/50`.
  - CheckCircle2 / Circle (Lucide), Badge for priority (`text-red-400`, `text-amber-400`, `text-emerald-400`), Trash2 on hover.
- **Quick Intel**:
  - Rows: `bg-slate-800/30`, `border-slate-700/50`; Status row `bg-emerald-900/30`, `border-emerald-700/50`, pulse dot.
- **Active Ops**:
  - Each project: `bg-slate-800/30`, `border-emerald-900/30`, `rounded-lg`.
  - Progress bar, Badge “X% COMPLETE”.
  - Milestones: `grid-cols-2`, clickable buttons, CheckCircle2/Circle, `bg-emerald-900/30` when done.

### life-jet 5174

- **Root**: Same gradient via `var(--bg-gradient)` / fallback.
- **Header**: Custom styled-jsx (`vb-header`), `rgba(30,41,59,0.95)`, `border` cyan. No blur.
- **Cards**: Uses **life-jet** components. Vision Matrix, Daily Ops, Quick Intel use `styles.css` (e.g. `var(--border-emerald)`, `.vision-photo`, `.daily-ops`, `.todo-item`). Different class names and structure.
- **Vision Matrix**: `.vision-matrix` grid, `.vision-photo`, `.vision-photo-overlay`, `.vision-photo-caption`, `.vision-photo-label`. Click to delete (no hover-only delete). Different typography and borders.
- **Daily Ops**: `.daily-ops`, `.progress-bar`, `.todo-list`, `.todo-item`, `.todo-checkbox`, `.todo-priority`. Different layout and no Lucide.
- **Quick Intel**: `.quick-intel`, `.intel-item`. Simplified vs 3000.
- **Active Ops**: Rendered in **vb-bottom** (full-width bar). Uses `.operations-list`, `.operation-card`, etc. Layout different from 3000’s in-grid cards.

---

## 4. Summary: why it doesn’t look the same

1. **Layout**: 3000 uses 8+4 grid with Active Ops as a **card** in the left column; 5174 uses 2-col + **bottom bar** for Active Ops.
2. **Navigation**: 3000 = **Tabs** with icons and multiple panels (Command, Health, Income, etc.); 5174 = non-functional nav buttons, Command-only content.
3. **Components**: 3000 = custom Tailwind/shadcn UI; 5174 = life-jet components with different HTML/CSS.
4. **Visual polish**: 3000 = gradient lines, backdrop blur, `card-glow`, Lucide icons, Framer Motion; 5174 = fewer effects, emoji icons, no motion.
5. **Styling**: 3000 = Tailwind utility classes; 5174 = styled-jsx + `styles.css` variables and life-jet classes.

---

## 5. How to make 5174 match 3000

- **Layout**: Switch to 12-col grid, **8+4**. Put Vision Matrix + Active Ops in the **left** column; Daily Ops + Quick Intel in the **right**. Remove the bottom bar.
- **Header**: Add top/bottom gradient lines. Use Shield-style icon, same structure as 3000. Style Operation Phoenix as a box; put Weather/B+/Clock in small card-like blocks.
- **Nav**: Implement **tabs** (or tab-like UI). Command tab = current Vision + Daily Ops + Quick Intel + Active Ops. Optional: add other tabs later.
- **Cards**: Wrap each section in a “card” with `bg-slate-800/50`, `border-cyan-500/20`, `backdrop-blur-sm`, rounded corners. Optionally add `card-glow`-style shadow.
- **Vision Matrix**: Match 3000’s grid (2–3 cols), overlay, Crosshair-style caption, TARGET-01 label, hover delete. Use Tailwind for spacing/borders/typography.
- **Daily Ops / Quick Intel / Active Ops**: Align structure and styles with 3000 (progress bars, priority badges, intel rows, milestone grid). Use Lucide icons if added to life-jet; otherwise approximate with emoji/SVG.
- **Background**: Keep same gradient; add fixed gradient lines top and bottom.

Applying these in `app/vision-board/page.js` (and any shared components) will make 5174’s Vision Board much closer to localhost:3000.
