# Companion vision: educational vortex

The companion is the **core product** for conversion: it communicates, pulls up items, supports voice, and can feel more live-generated. The site is the place you browse *with* the bot—a host and guide, not a support widget. The experience is **experiential**, **gamified**, and **educational**, with a retro-futuristic, Jetsons-style character that feels cool and modern without slowing the site.

---

## Scope: side project page (don’t mess up the store)

- **Classic Medusa store first.** The foundational store (cart, checkout, products from Medusa, standard pages) must be solid and stay stable. That’s the base.
- **Companion lives on a side project page.** The full companion experience (chat, voice, live-generated feel, pull-up items) lives on a **dedicated page** (e.g. `/experience` or `/companion`), not baked into every route from day one. Tune and iterate there without risking the core store.
- **Conversion engine.** On that page, the companion *is* the main conversion engine—lead capture, sell, upsell, humor—but the rest of the site remains a classic Medusa storefront.

---

## Product principles

- **Companion-first**  
  Chat/voice is the primary interface; the store is the shared “world” you and the bot move through.

- **Adventure feeling**  
  Guided discovery, recommendations, and conversation—not just Q&A or checkout help. It’s like having a friendly robot guide.

- **Educational vortex**  
  Learning and discovery are central. The companion pulls you into short, focused “vortex” moments: ingredient deep-dives, product stories, how-to tips—then lets you surface and browse.

- **Journeys in and out**  
  The bot **dives in and out of journeys**. It surfaces for moments (e.g. “Want to know why this formula works?” or “Here’s a quick tip”) then recedes. Episodic, contextual—not an always-on wall of chat.

- **Gamification**  
  Light progression, discovery, or “unlocks” (e.g. learning a new ingredient, completing a mini-journey). Experiential, not transactional.

---

## Companion goals (business)

The companion isn’t just a guide—it’s a **good salesperson** with clear goals, delivered in a **humorous**, character-driven way (never pushy or sleazy).

- **Lead capture**  
  Get contact info (email, optional name/phone) naturally inside the flow: e.g. “Leave me your email and I’ll send you the one tip that actually changed my circuits” or “Drop your email for early access / the ingredient cheat sheet.” The ask feels like part of the adventure, not a form.

- **Sell and upsell**  
  Recommend products, cross-sell (e.g. “This pairs great with …”), and upsell (e.g. “Most humans who liked this also grabbed the bundle—here’s why”) in conversation. The bot has product knowledge (RAG) and can suggest add-ons or bundles at the right moment in a journey.

- **Humorous tone**  
  Wit, light jokes, and personality (Jetsons-style robot voice) so lead capture and sales feel like banter, not pressure. The character *wants* to help and sell, but does it with charm—e.g. “I’m programmed to suggest the bundle. I’m also programmed to be right. Just saying.”

---

## Look and feel

- **Jetsons-style / retro-futuristic**  
  A recognizable “bot” character or avatar—friendly, modern, a bit playful. Think sleek 60s future: rounded, clean, optimistic. Not a generic chat bubble.

- **Cool, modern interaction**  
  Animations and micro-interactions that feel polished: the companion “wakes up,” reacts to context (product viewed, scroll position), maybe subtle sound or haptic. No clunky modals.

- **Does not slow the site**  
  The main app shell and first paint stay fast. Companion UI and logic are **lazy-loaded** (e.g. dynamic import). No heavy JS or assets blocking the critical path. Feels instant.

---

## Technical direction

- **Edge compute**  
  Chat, streaming, and lightweight APIs run on the edge (e.g. Vercel Edge Functions, Edge API routes). Low latency, globally distributed. The “educational vortex” and journey logic should be edge-friendly: small payloads, streamed responses.

- **Lazy-loaded companion**  
  Companion shell (avatar, chat pane, voice UI) is loaded after initial page render—e.g. `next/dynamic` with `ssr: false` or a small loader that fetches the companion bundle on first interaction or after idle. Main bundle stays small.

- **Journey triggers**  
  Define clear “in” and “out” moments: e.g. scroll depth, product view, time on page, or explicit “Tell me more.” The companion appears for a **journey** (a few exchanges), then can minimize or disappear until the next trigger. Keeps the experience episodic and intentional.

- **RAG + context**  
  Product knowledge (and later, educational content) in a RAG layer so the bot can answer accurately and suggest journeys. Context can include current page, last product viewed, etc., so the bot feels like it’s “in the room” with you.

---

## Summary

| Idea | Meaning |
|------|--------|
| **Jetsons bot** | Retro-futuristic, friendly character; cool modern interaction. |
| **No slow load** | Companion lazy-loaded; edge for APIs; main site stays fast. |
| **Gamification** | Experiential, light progression, discovery, “unlocks.” |
| **Educational vortex** | Short, immersive learning moments; then surface and browse. |
| **Journeys in/out** | Bot surfaces for episodes, recedes; episodic, not overwhelming. |
| **Edge compute** | Chat and streams on the edge; fast, global, small payloads. |
| **Lead + sell/upsell** | Get contact, recommend and upsell—in a humorous, character-driven way. |

This doc is the north star for the companion: **experiential, edge-first, and journey-based**, with a Jetsons-style character that never gets in the way of a fast, smooth site. Its goals are **lead capture**, **sell**, and **upsell**—achieved through humor and charm, not pressure.
