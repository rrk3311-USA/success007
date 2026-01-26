# Side-by-Side Code Comparison: /home vs /vision-board vs localhost:3000

**Quick reference for learning code patterns**

---

## 1. LAYOUT CODE

### `/home` - Fixed 3-Panel Grid

```jsx
// app/home/page.js
<div className="main-content">
  <div className="panel left-panel">...</div>
  <div className="panel center-panel">...</div>
  <div className="panel right-panel">...</div>
</div>
```

```css
/* styles.css */
.main-content {
  display: grid;
  grid-template-columns: 320px 1fr 320px;  /* Fixed widths */
  gap: var(--space-md);
}

.panel {
  background: var(--slate-800-alpha);
  border: 1px solid var(--border-clay);
  border-radius: 0;  /* Linear design */
}
```

**Key:** Fixed 320px sidebars, center flexible. Not responsive.

---

### `/vision-board` (life-jet) - Responsive 12-Col Grid

```jsx
// app/vision-board/page.js
<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
  <div className="lg:col-span-8">...</div>
  <div className="lg:col-span-4">...</div>
</div>
```

**Key:** `grid-cols-1` on mobile (stacks), `lg:grid-cols-12` on desktop. Responsive by default.

---

### `localhost:3000` - Same 12-Col Grid + Card Wrapper

```jsx
// src/pages/LifeVisionBoard.tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
  <div className="lg:col-span-8">
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <VisionMatrix />
    </Card>
  </div>
</div>
```

**Key:** Same grid, but wrapped in `Card` component for consistent styling.

---

## 2. STYLING CODE

### `/home` - CSS Variables

```jsx
// Component
<div style={{ 
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-display)',
  background: 'var(--bg-gradient)'
}}>
  <h2 style={{ color: 'var(--cyan)' }}>Title</h2>
</div>
```

```css
/* styles.css */
:root {
  --cyan: #06B6D4;
  --text-primary: #F1F5F9;
  --font-display: 'Orbitron', monospace;
  --bg-gradient: linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #0f1b2d 100%);
}
```

**Key:** Styles defined once in CSS, referenced with `var(--name)`.

---

### `/vision-board` (life-jet) - Tailwind Classes

```jsx
// Component
<div className="bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm rounded-lg">
  <h2 className="text-lg font-semibold text-cyan-400">Title</h2>
</div>
```

**Key:** Utility classes directly in JSX. No separate CSS file needed.

---

### `localhost:3000` - Tailwind + shadcn Components

```jsx
// Component
<Card className="bg-slate-800/50 border-cyan-500/20">
  <div className="p-4 border-b border-emerald-900/50">
    <h2 className="text-lg font-semibold text-cyan-400">Title</h2>
  </div>
</Card>
```

**Key:** Pre-built `Card` component + Tailwind for customization.

---

## 3. ICONS CODE

### `/home` - Emoji

```jsx
<button>
  <span>🎯</span> Daily Focus
</button>
```

**Key:** Just emoji text. Zero bundle size.

---

### `/vision-board` (life-jet) - Emoji

```jsx
<button>
  <span>🛡</span> Command
</button>
```

**Key:** Same as `/home`.

---

### `localhost:3000` - Lucide React

```jsx
import { Shield, Eye, Crosshair } from "lucide-react";

<Shield className="w-5 h-5 text-emerald-500" />
<Eye className="w-4 h-4 text-cyan-400" />
```

**Key:** Import icons, use as components. Stylable with Tailwind.

---

## 4. ANIMATIONS CODE

### `/home` - None

```jsx
// No animations
<div className="panel">...</div>
```

**Key:** Static. Fastest performance.

---

### `/vision-board` (life-jet) - CSS Transitions

```jsx
<div className="hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:-translate-y-0.5 transition-all">
  ...
</div>
```

**Key:** CSS-only. GPU-accelerated. No JS.

---

### `localhost:3000` - Framer Motion

```jsx
import { motion, AnimatePresence } from "framer-motion";

<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
>
  ...
</motion.div>
```

**Key:** JS-based animations. More powerful, but adds bundle size.

---

## 5. COMPONENT STRUCTURE

### `/home` - Custom Component (CSS Variables)

```jsx
// components/HUD.jsx
function HUD({ systemStatus }) {
  return (
    <div className="hud-container">
      <div className="hud-logo">LIFE JET</div>
      <div className="hud-stats">...</div>
    </div>
  );
}
```

```css
/* styles.css */
.hud-container {
  background: var(--slate-800-alpha);
  border-bottom: 1px solid var(--border-cyan);
}
```

**Key:** Component uses global CSS classes. Styles in separate file.

---

### `/vision-board` (life-jet) - Custom Component + Tailwind Wrapper

```jsx
// app/vision-board/page.js
<div className="bg-slate-800/50 border border-cyan-500/20">
  <VisionMatrix photos={visionPhotos} />
</div>
```

**Key:** Tailwind on wrapper, component uses CSS vars internally.

---

### `localhost:3000` - shadcn Component

```jsx
// Using shadcn Card
<Card className="bg-slate-800/50 border-cyan-500/20">
  <div className="p-4">
    <h2>Content</h2>
  </div>
</Card>
```

**Key:** Pre-built component. Just customize with Tailwind classes.

---

## 6. TABS CODE

### `/home` - Custom Tabs (CSS Variables)

```jsx
<div className="tabs-list">
  <button 
    className={`tab-btn ${activeTab === 'daily-focus' ? 'active' : ''}`}
    onClick={() => setActiveTab('daily-focus')}
  >
    <span>🎯</span> Daily Focus
  </button>
</div>
```

```css
.tab-btn.active {
  background: var(--slate-700-alpha);
  color: var(--cyan);
  border-color: var(--border-cyan);
}
```

**Key:** Manual active state. CSS classes for styling.

---

### `/vision-board` (life-jet) - Tailwind Tabs

```jsx
<div className="flex flex-wrap gap-1 p-1 bg-slate-900/60 border border-slate-700/50">
  {tabs.map((tab) => (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={`px-4 py-2 rounded ${
        activeTab === tab.id
          ? 'bg-slate-700/50 text-sky-400'
          : 'text-gray-400'
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

**Key:** Tailwind utilities. Conditional classes for active state.

---

### `localhost:3000` - shadcn Tabs

```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="command">
      <Shield className="w-4 h-4 mr-2" />
      Command
    </TabsTrigger>
  </TabsList>
  <TabsContent value="command">...</TabsContent>
</Tabs>
```

**Key:** Pre-built component. Handles active state automatically.

---

## 7. HEADER CODE

### `/home` - Custom HUD Component

```jsx
// components/HUD.jsx
<div className="hud-container">
  <div className="hud-logo">LIFE JET</div>
  <div className="hud-stats">
    <div className="hud-stat">
      <div className="hud-stat-label">DEALS</div>
      <div className="hud-stat-value">{dealsCount}</div>
    </div>
  </div>
</div>
```

```css
.hud-container {
  background: var(--slate-800-alpha);
  border-bottom: 1px solid var(--border-cyan);
  backdrop-filter: blur(12px);
}
```

**Key:** Semantic class names. Styles in CSS file.

---

### `/vision-board` (life-jet) - Tailwind Header

```jsx
<header className="border-b border-cyan-500/20 bg-slate-900/90 backdrop-blur-md">
  <div className="container mx-auto px-4 md:px-6 py-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded bg-gradient-to-br from-emerald-500 to-cyan-500">
        🛡
      </div>
      <h1 className="text-lg md:text-2xl font-bold text-cyan-400">
        LIFE VISION BOARD
      </h1>
    </div>
  </div>
</header>
```

**Key:** All Tailwind. Responsive with `md:` breakpoints.

---

### `localhost:3000` - Tailwind + Lucide Icons

```jsx
<header className="border-b border-cyan-500/20 bg-slate-900/90 backdrop-blur-md">
  <div className="container mx-auto px-4 md:px-6 py-3">
    <div className="flex items-center gap-3">
      <div className="relative">
        <Shield className="w-8 h-8 text-emerald-500" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
      </div>
      <h1 className="text-lg md:text-2xl font-bold text-cyan-400">
        LIFE VISION BOARD
      </h1>
    </div>
  </div>
</header>
```

**Key:** Same as `/vision-board`, but with Lucide icons instead of emoji.

---

## 8. STATE MANAGEMENT

### All Three - Same React Hooks

```jsx
// All use useState and useEffect the same way
const [activeTab, setActiveTab] = useState('command');
const [todos, setTodos] = useState([...]);

useEffect(() => {
  // Side effects
}, []);
```

**Key:** No difference. All use React hooks.

---

## 9. PERFORMANCE IMPLICATIONS

### CSS Variables (`/home`)

```css
:root { --cyan: #06B6D4; }
```

**Runtime:** CSS variables are native, parsed once. **Fastest.**

---

### Tailwind (`/vision-board`, `localhost:3000`)

```jsx
<div className="bg-slate-800/50 text-cyan-400">
```

**Runtime:** Classes are pre-generated. HTML is larger, but CSS is cached. **Fast.**

---

### Framer Motion (`localhost:3000`)

```jsx
<motion.div animate={{ opacity: 1 }}>
```

**Runtime:** JS animations. Can cause jank on low-end devices. **Medium.**

---

## 10. THEMING CODE

### `/home` - Change CSS Variables

```css
/* Change once, updates everywhere */
:root {
  --cyan: #06B6D4;  /* Change to #00FF00 = green theme */
}
```

**Key:** One file change = entire app themed.

---

### `/vision-board` / `localhost:3000` - Tailwind Config

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      cyan: { 400: '#06B6D4' }  // Change here
    }
  }
}
```

**Key:** Need to rebuild Tailwind. More steps.

---

## SUMMARY: WHEN TO USE WHAT

### Use `/home` approach (CSS Variables) when:
- ✅ Maximum performance is critical
- ✅ You want easy theming
- ✅ You prefer semantic class names
- ✅ You don't need rapid prototyping

### Use `/vision-board` approach (Tailwind) when:
- ✅ You want responsive by default
- ✅ You want fast development
- ✅ You want consistent spacing/colors
- ✅ You don't need complex animations

### Use `localhost:3000` approach (Tailwind + shadcn) when:
- ✅ You want fastest component building
- ✅ You want polished animations
- ✅ You want professional icons
- ✅ Bundle size isn't critical

---

## LEARNING PATH

1. **Start with `/home`** - Learn CSS Variables, semantic HTML
2. **Add Tailwind** - Learn utility classes, responsive design
3. **Add shadcn** - Learn component composition
4. **Add Framer Motion** - Learn animation patterns (optional)
