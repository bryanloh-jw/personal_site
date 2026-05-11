# Personal Site — Design Document

## Understanding Summary

- **What:** A personal portfolio site built with Astro 6, targeting software engineering recruiters
- **Pages:** Home, About, Blog (mixed technical + career posts), Resume
- **Audience:** Recruiters — professional credibility, resume accessible, blog supports credibility
- **Styling:** Terminal/hacker aesthetic, dark-first, amber accent, monospace fonts, light/dark toggle
- **Stack:** Astro 6 + React (islands) + Tailwind CSS, fully static output
- **Deployment:** Docker (two-stage build) → Caddy → DigitalOcean droplet

## Non-Goals

- No CMS, no database, no SSR
- No comments, search, or authentication at launch
- Not a visual design portfolio (no case studies or image-heavy content)
- No CI/CD pipeline at launch

## Assumptions

1. Blog posts written in Markdown files inside `src/content/blog/`
2. React used only where interactivity is needed (theme toggle); rest is plain Astro
3. No CI/CD pipeline needed at launch — manual Docker build and deploy
4. Performance target: solid Lighthouse score, no exotic optimization
5. User manages their own DigitalOcean droplet and domain

---

## Project Structure

```
src/
├── components/
│   ├── Nav.astro
│   ├── ThemeToggle.tsx       # React island
│   ├── PostCard.astro
│   └── Footer.astro
├── content/
│   ├── config.ts             # Blog collection schema
│   └── blog/
│       └── example-post.md
├── layouts/
│   ├── Layout.astro          # Base HTML shell
│   └── BlogPost.astro        # Single post layout
├── pages/
│   ├── index.astro           # Home ( / )
│   ├── about.astro           # About ( /about )
│   ├── resume.astro          # Resume ( /resume )
│   └── blog/
│       ├── index.astro       # Blog listing ( /blog )
│       └── [...slug].astro   # Dynamic post route ( /blog/post-title )
└── styles/
    └── global.css            # Tailwind imports + global overrides
```

---

## Content Collections Schema

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    category: z.enum(['technical', 'career']),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

**Blog post frontmatter:**

```md
---
title: "Post title"
description: "Short summary for cards and meta tags"
date: 2026-05-11
tags: ["astro", "web"]
category: technical
draft: false
---
```

---

## Theming — Dark Mode

**Priority order:**
1. Stored `localStorage` preference (explicit user override)
2. OS/browser `prefers-color-scheme`
3. Dark fallback (matches site aesthetic)

**Inline script in `<head>` (runs before paint — prevents flash):**

```html
<script is:inline>
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored ?? (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

**Tailwind config:**

```js
export default {
  darkMode: 'class',
}
```

`ThemeToggle.tsx` toggles the `dark` class on `<html>` and writes to `localStorage`.

---

## Page Designs

### Home (`/`)
- Hero: name, title, 1-line bio, two CTAs (View Resume, Read Blog)
- Blinking cursor in hero for terminal aesthetic
- 2–3 most recent blog post cards below

### About (`/about`)
- Single-column readable layout
- Bio, tech stack/skills list, social links (GitHub, LinkedIn, email)

### Blog listing (`/blog`)
- Grid of `PostCard` components
- Filter tabs: `All | Technical | Career`
- Each card: title, date, category, description

### Resume (`/resume`)
- PDF embed (`<iframe>`) taking most of viewport
- Prominent "Download PDF" button above
- Fallback link if embed fails

---

## Deployment Architecture

```
DigitalOcean Droplet
└── Docker Container
    ├── Caddy (auto HTTPS via Let's Encrypt)
    └── /srv/  ← astro build output (dist/)
```

**Dockerfile:**

```dockerfile
# Stage 1: Build
FROM node:22 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve
FROM caddy:alpine
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
```

**Caddyfile:**

```
your-domain.com {
    root * /srv
    file_server
    try_files {path} /index.html
}
```

**Astro config:**

```js
export default defineConfig({
  output: 'static',
});
```

---

## Decision Log

| # | Decision | Alternatives Considered | Reason |
|---|----------|------------------------|--------|
| 1 | Astro Content Collections for blog | Plain `.md` in `pages/`, headless CMS | Type-safe, validated, built-in to Astro, scales cleanly |
| 2 | Tailwind CSS for styling | Plain CSS, UnoCSS | Dark mode `class` strategy built-in, fast to build terminal aesthetic |
| 3 | React for interactive components | Svelte, Preact, plain JS | Familiarity, large ecosystem |
| 4 | Static output (`output: 'static'`) | SSR | Personal site with no dynamic data needs |
| 5 | Terminal aesthetic, dark-first, amber accent | Other visual styles | Recruiter audience, signals engineering identity |
| 6 | Theme: `prefers-color-scheme` → `localStorage` override | Always dark, always light | Respects OS preference, user override persists |
| 7 | Caddy as web server | Nginx | Simpler config, automatic HTTPS |
| 8 | Two-stage Docker build | Single stage | Keeps production image small, no Node in prod |
| 9 | Blog categories: `technical` \| `career` + freeform tags | Tags only | Mirrors mixed content plan, enables filtering |
| 10 | Resume as PDF embed + download button | Full HTML resume, PDF only | Fast to maintain, always in sync with actual CV |
