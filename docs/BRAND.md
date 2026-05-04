# Levine LLP — Brand & Design Standards

> Source of truth for visual language, layout systems, and interaction patterns across levinellp.ca (public) and the client portal.
> This document defines what we do and what we do not do.
> All tokens map directly to `styles/tailwind.css` and Tailwind CSS v4 `@theme` definitions.
> Last updated: 2026-05-03

---

## 1. Brand Positioning

**Firm name:** Levine LLP
**Informal:** Levine Law

**Positioning:**
Fractional corporate, contract, and financial services counsel for operators, investors, and regulated businesses.

**Tone:**
- Direct
- Precise
- Time-aware
- Commercially literate

**Not:**
- Institutional
- Academic
- Startup-casual
- Over-explained

**Design translation:**
- Structure > decoration
- Density > simplification
- Typography > imagery
- Restraint = credibility

---

## 2. Logo Assets

All logo files live in `public/logos/`. Source files are PNG. Do not edit ratio or dimensions.

### Wordmarks — 1080 × 600px (9:5)

| File | Description | Use when |
|---|---|---|
| `levine-law-wordmark-navy-transparent.png` | Navy text, transparent bg | **Default — headers, white surfaces** |
| `levine-law-wordmark-navy.png` | Navy text, white bg | White-bg contexts where transparency is unsupported |
| `levine-law-wordmark-blue.png` | Bright blue text, white bg | — |
| `levine-law-wordmark-blue-transparent.png` | Bright blue text, transparent bg | — |
| `levine-law-wordmark-black.png` | Black text, white bg | Print, high-contrast neutral |
| `levine-law-wordmark-black-transparent.png` | Black text, transparent bg | Print, transparent contexts |
| `levine-law-wordmark-white-on-navy.png` | White text, flat navy bg | Dark navy surfaces |
| `levine-law-wordmark-white-on-black.png` | White text, black bg | Dark neutral surfaces |
| `levine-law-wordmark-white-on-gradient.png` | White text, blue gradient bg | Marketing / social use |
| `levine-law-wordmark-navy-gradient.png` | Navy gradient square format | Social / OG image use |
| `levine-law-wordmark-navy-transparent-2.png` | Navy text, transparent bg (alt crop) | Use if `-transparent` has unwanted whitespace |

### Icons — 500 × 500px (1:1)

| File | Description | Use when |
|---|---|---|
| `levine-law-icon-navy.png` | Navy text, white bg | Favicons, app icons, small square contexts |
| `levine-law-icon-white-on-navy.png` | White text, flat navy bg | Dark bg square contexts |
| `levine-law-icon-black.png` | Black text, white bg | Print, high-contrast |
| `levine-law-icon-white-on-black.png` | White text, black bg | Dark neutral square contexts |
| `levine-law-icon-white-on-gradient.png` | White text, blue gradient | Social profile, marketing |

### Usage in code

```tsx
{/* Standard header — white background */}
<Image
  src="/logos/levine-law-wordmark-navy-transparent.png"
  alt="Levine Law"
  width={1080}
  height={600}
  className="h-10 w-auto"
/>

{/* Dark background surface */}
<Image
  src="/logos/levine-law-wordmark-white-on-navy.png"
  alt="Levine Law"
  width={1080}
  height={600}
  className="h-10 w-auto"
/>
```

Always set `width={1080} height={600}` for wordmarks and `width={500} height={500}` for icons — these are the source dimensions Next.js uses for aspect ratio. Control display size with CSS (`h-10 w-auto`, etc.) not the props.

---

## 3. Visual Identity Principles

These govern all design decisions:

- Clarity over cleverness
- Hierarchy over volume
- Consistency over novelty
- Restraint over expression

Every screen must answer:
1. What is this?
2. What can I do?
3. What should I do next?

---

## 4. Color System

### Brand tokens

Defined in `styles/tailwind.css` as `@theme` variables. Use these tokens — never raw hex values.

| Token | Value | Role |
|---|---|---|
| `brand-navy` | `#1D4771` | Primary identity. CTAs, active states, eyebrow labels. |
| `brand-navy-dark` | `#0d3d7c` | Hover state for `brand-navy` surfaces. |
| `brand-blue` | `#0365B2` | Secondary accent. Links, emphasis, selective UI elements. |
| `brand-red` | `#FF5E5B` | Attention and critical actions only. |
| `ink` | `#2E2E2E` | Primary text — headings and high-contrast body. |
| `border-subtle` | `#D1D5DB` | Hard UI borders — tables, dividers, separators. |

**Critical rule:** `brand-blue` and `brand-red` are not decorative colors. They signal meaning. Use them sparingly — not to create visual interest.

### Stone palette (primary UI palette)

Levine LLP uses the Tailwind `stone` scale as the base. Do not use `gray` or `slate`.

| Token | Use |
|---|---|
| `stone-600` | Body text, form labels, table content |
| `stone-500` | Supporting copy, muted descriptions |
| `stone-400` | Metadata (dates, IDs), placeholder text, captions |
| `stone-300` | Secondary borders, hover borders |
| `stone-200` | Default card/input borders |
| `stone-100` | Subtle chip backgrounds, skeleton loaders |
| `stone-50` | Page-level backgrounds (portal base, alternating public sections) |
| `white` | Card surfaces, header, primary content areas |

Two explicit overrides sit above the stone scale:
- **`ink`** — preferred over `stone-900` for headings
- **`border-subtle`** — preferred over `stone-200` for tables, separators, and high-contrast dividers

### Semantic colors

Used only for status communication — not decorative.

| Meaning | Background | Text | When to use |
|---|---|---|---|
| Attention / action needed | `bg-amber-50` | `text-amber-700` | Requests received, matters awaiting client action, warnings |
| Active / in progress | `bg-brand-navy/10` | `text-brand-navy` | In Review status, active state badges |
| Success / complete | `bg-green-50` | `text-green-700` | Accepted, Complete, success banners |
| Neutral / closed | `bg-stone-100` | `text-stone-500` | Complete status, closed matters, inactive items |
| Declined / removed | `bg-stone-100` | `text-stone-400` | Declined requests, archived items |
| Error | `bg-red-50` | `text-red-700` | Validation errors, failed actions |

---

## 5. Typography

### Base strategy

No custom font is loaded. The site uses the system font stack (Apple system-ui on macOS/iOS, Segoe UI on Windows). This is intentional for performance and rendering quality — do not add a web font without deliberate decision.

Brand identity is carried through spacing, tracking, and hierarchy — not font choice.

### Scale

| Role | Tailwind class |
|---|---|
| Hero heading | `text-5xl sm:text-6xl font-semibold tracking-tight leading-tight text-ink` |
| H1 (portal pages) | `text-3xl font-semibold tracking-tight text-ink` |
| H2 (public sections) | `text-2xl font-semibold tracking-tight text-ink` |
| Card title | `text-lg font-semibold text-ink` |
| Sub-section heading | `text-base font-semibold text-ink` |
| Form section heading | `text-sm font-semibold text-ink` |
| Body — standard | `text-[15px] leading-7 text-stone-600` |
| Body — compact (portal lists) | `text-sm leading-6 text-stone-600` |
| Metadata | `text-xs text-stone-400` |
| Badge / chip | `text-xs font-medium` |

### Eyebrow label (signature pattern)

The most recognisable typographic element on the site. Present above every major heading — always, without exception.

```tsx
<p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-navy">
  Context
</p>
<h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Page Title</h1>
<p className="mt-2 text-[15px] leading-7 text-stone-600">One-line supporting description.</p>
```

Rules:
- Always present above major headings
- Always `mb-3` or `mt-3` spacing between eyebrow and heading
- Never omit on portal pages or public section openers

---

## 6. Layout & Spacing

### Containers

| Context | Class |
|---|---|
| Public site | `max-w-6xl px-6` |
| Portal pages | `max-w-5xl px-6` |
| Narrow (forms, centered) | `max-w-2xl` or `max-w-xl` |

### Signature layout pattern

Used for high-value public sections where a label/heading sits beside content:

```tsx
<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
  <div className="lg:col-span-4">
    {/* Eyebrow + heading */}
  </div>
  <div className="lg:col-span-8">
    {/* Content */}
  </div>
</div>
```

### Section rhythm (public site)

| Context | Class |
|---|---|
| Standard section vertical padding | `py-20 md:py-24` |
| Lighter section | `py-16` |
| Space before section grid/content | `mb-12` |
| Gap between grid cards | `gap-6 md:gap-8` |

### Section rhythm (portal)

| Context | Class |
|---|---|
| Page vertical padding | `py-10` |
| Space between major page sections | `mt-12` |
| Space between section heading and content | `mt-4` or `mt-5` |
| Space between list items | `space-y-3` |

Section separator between major portal sections:
```tsx
<div className="border-t border-border-subtle pt-8 mt-12" />
```

### Card padding

| Context | Padding |
|---|---|
| Public feature cards | `p-6 md:p-8` |
| Portal content cards | `px-5 py-5` |
| Portal list rows | `px-5 py-4` |
| Form section cards | `px-5 py-5` |

---

## 7. Component Patterns

### Page backgrounds

Public site sections alternate `bg-white` and `bg-stone-50`. Portal pages use `bg-stone-50` as the base with `bg-white` card surfaces. No other background colors.

### Cards

**Public site cards:**
```tsx
<div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8 transition hover:border-stone-300 hover:shadow-md hover:-translate-y-[1px]">
```

**Portal cards:**
```tsx
<div className="rounded border border-stone-200/80 bg-white px-5 py-5 transition hover:border-stone-300">
```

The distinction is intentional: `rounded-2xl` on the public site reads as warmer. `rounded` in the portal reads as precise. Do not mix contexts.

### Buttons

**Primary (filled):**
```tsx
className="rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy-dark hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-navy/40"
```

**Secondary (outlined):**
```tsx
className="rounded-md border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
```

**Small primary** (portal nav, inline actions):
```tsx
className="rounded bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
```

**Rules:**
- One primary button per screen. Never two filled buttons adjacent to each other.
- Button text is sentence-case action phrases — not "SUBMIT" or nouns.

### Links

**Inline text links:**
```tsx
className="relative font-semibold text-brand-navy after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-brand-navy after:transition-all hover:after:w-full"
```

**Simple underline links (portal):**
```tsx
className="font-semibold text-brand-navy underline-offset-2 hover:underline"
```

### Status badges

```tsx
<span className="rounded px-2 py-1 text-xs font-medium {color-classes}">
  {status}
</span>
```

Color classes per status: see Semantic Colors table above.

### Eyebrow + heading block

```tsx
<p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-navy">{context}</p>
<h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{page title}</h1>
<p className="mt-2 text-[15px] leading-7 text-stone-600">{one-line supporting description}</p>
```

### Form cards

Each logical group in a form gets its own white card:

```tsx
<div className="rounded border border-stone-200 bg-white px-5 py-5">
  <h2 className="text-sm font-semibold text-ink">{Section title}</h2>
  <p className="mt-1 text-sm text-stone-500">{Helper text}</p>
  {/* field */}
</div>
```

### Empty states

```tsx
<p className="mt-3 text-sm text-stone-400">
  No {items} yet.{" "}
  <Link href="..." className="font-medium text-brand-navy underline-offset-2 hover:underline">
    {CTA if applicable.}
  </Link>
</p>
```

Empty states always include a prompt when there is a natural next action.

### Success / error banners

```tsx
{/* Success */}
<div className="mt-6 rounded border border-green-200 bg-green-50 px-5 py-4 text-sm">
  <p className="font-semibold text-green-900">{Title}</p>
  <p className="mt-1 text-green-700">{Body}</p>
</div>

{/* Error */}
<div className="mt-6 rounded border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
  {message}
</div>
```

### Interaction principles

- Motion duration: under 150ms
- No bounce or overshoot easing
- Hover communicates clarity, not delight
- `transition` on interactive surfaces; `transition-colors` when only color changes

---

## 8. Data Display

### Tables

```tsx
<table className="w-full text-sm divide-y divide-border-subtle">
```

**Headers:**
```tsx
className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-500"
```

**Rows:**
```tsx
className="hover:bg-stone-50"
```

---

## 9. Public Site Structure

### Header

Logo left, nav links + portal button right. Nav links: `text-stone-600 hover:text-stone-900`. Portal button: outlined (`border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white`).

### Authority strip

A low-weight band between major sections to establish credibility without overclaiming:

```tsx
<div className="border-y border-border-subtle py-6 text-sm text-stone-600">
  Trusted by operators across financial services, private markets, and regulated businesses.
</div>
```

### Section rule

No section starts without: eyebrow → heading → one-line explanation. Never open directly into content.

### Page-level max width

All content constrains to `max-w-6xl px-6`. Nothing full-bleeds except background colors.

---

## 10. Portal Structure

### Core principle

The portal is a workspace, not a dashboard.

### Visual layering

| Layer | Style |
|---|---|
| Page base | `bg-stone-50` |
| Section grouping | Separator (`border-t border-border-subtle`) + spacing |
| Card surfaces | `bg-white` |

### Layout

```
Header (Levine LLP / Client Portal / signed-in user / sign out)
├── Sidebar nav (240px on lg+, stacks on mobile)
│   ├── Matters       ← portal home, active when on /app
│   ├── Documents
│   ├── Requests
│   ├── Scope
│   └── Tools → NDA Tool ↗
└── Main content area
```

### Active sidebar state

```tsx
{/* Active */}
className="block rounded-md border border-brand-navy/20 bg-brand-navy/5 px-3 py-2 text-sm font-medium text-brand-navy"

{/* Inactive */}
className="block rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
```

Active state must reflect the current route. Currently hardcoded to "Matters" — known gap.

### Portal sub-page nav

Every portal sub-page opens with a back link:

```tsx
<nav className="flex items-center justify-between text-sm">
  <Link
    href="/corporate/app"
    className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
  >
    ← Portal home
  </Link>
  {/* optional primary action on right */}
</nav>
```

### Preview mode banner

```tsx
<div role="status" className="bg-amber-50 px-6 py-3 text-sm font-medium text-amber-950">
  Preview mode: this portal is using a mock session for development review only.
</div>
```

---

## 11. Writing Style

**Headings:** Sentence case only. Never title case on section headings or body copy.

**CTAs:** Action phrases, not nouns.
- Good: "Open a matter", "Review documents", "Explore Counsel Models"
- Bad: "Submit", "Click here", "Matter Request"

**Legal language:** Do not write "legal advice," "representation," or "retainer" in UI copy without counsel review.
- Prefer: counsel, support, engagement, scope

**Portal labels:** Use "matter" not "case." Use "counsel" not "lawyer" in client-facing UI where tone allows.

---

## 12. What We Do Not Do

- **No dashboards.** No stat blocks, progress rings, or summary widgets. The matter list is the home screen.
- **No gradients.** Background colors are flat.
- **No drop shadows by default.** `hover:shadow-md` on interactive cards only.
- **No full-bleed imagery.** No hero photography or background images.
- **No icon libraries** unless explicitly introduced and justified.
- **No `gray` or `slate` palette.** Stone only, with `ink` and `border-subtle` overrides.
- **No `rounded-full`** on buttons or cards. `rounded` or `rounded-md` only.
- **No inline styles.** All styling via Tailwind utility classes.
- **No multiple primary CTAs.** One filled button per screen.
- **No decorative color usage.** `brand-blue` and `brand-red` signal meaning only.
