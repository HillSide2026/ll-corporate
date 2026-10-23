# Portal brand and design

How every portal page looks. Pages build from the shared pieces in
`src/components/brand/Brand.tsx`. Don't restyle them page by page.

The brand rules come from Levine Law doctrine in `ll-secondbrain`. This file
applies them to the portal:

- `01_DOCTRINE/03_POLICIES/POL-049_LL_Brand_Color_Palette_Policy.md` (colours)
- `01_DOCTRINE/03_POLICIES/POL-050_LL_Brand_Identity_Policy.md` (identity, imagery)

If this file and doctrine disagree, doctrine wins. Fix this file.

## Colour

| Token                     | Hex      | Use                                                                                             |
| ------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `brand-navy`              | #1D4771  | Feature panels, primary buttons, step numbers                                                   |
| `brand-blue`              | #0365B2  | Sign-in and sign-up buttons (navy on hover), button hover elsewhere, links, icons, small labels |
| `brand-red`               | #FF5E5B  | The short rule before a page's opening label. Nothing else                                      |
| `stone-50`                | Tailwind | Page background                                                                                 |
| `stone-200`               | Tailwind | Card borders                                                                                    |
| `stone-600` / `stone-950` | Tailwind | Body text / headings                                                                            |

Tokens are defined in `styles/tailwind.css`.

On the sign-in and sign-up pages the `NavyPanel` is the only navy: their buttons are brand blue (ML1, 2026-10-22: too much dark blue).

## Type

- **Display:** Libre Baskerville (`font-display`). Use it for page titles, section headings, card titles and names. It stands in on the web for Baskerville Display PT, the wordmark's typeface (POL-050 4.2a).
- **Text:** Montserrat (`font-sans`, the default). Use it for body copy, labels, forms and buttons (POL-050 4.2a).
- No other fonts.
- **Labels:** 11px, semibold, uppercase, wide tracking. Use the `Eyebrow` component.

## Building blocks (`src/components/brand/Brand.tsx`)

- **`NavyPanel`:** opens a page, or features something on it, such as the lawyers. It has a brand-blue glow and a faint grid, for the "architectural minimalism" POL-050 asks for. Use at most two per page.
- **`Eyebrow`:** the label above a heading. Use `tone="dark"` on navy. Set `rule` (the coral line) only on the label that opens a page.
- **`brandButton`:** the primary action. One per card or form.
- **`brandCard`:** a white card with a rounded 2xl border and a soft shadow, on the stone background.

## Page pattern (lead pages)

1. Header: wordmark, "Portal" and Sign out.
2. Progress bar, set explicitly with `IntakeShell step={n}`. Hide it on the welcome page.
3. A `NavyPanel` with an `Eyebrow`, a display title and one short paragraph.
4. Content in `brandCard`s. On forms, a side panel says what happens next.

Width is `max-w-5xl` for lead pages. Sections are spaced generously (`space-y-10` to `space-y-20`).

## Imagery

- Lawyer portraits are in `public/team/`, cropped square and shown as circles with a brand-blue ring. The source is legal.levine-law.ca.
- No clichéd legal imagery: no gavels, courthouses, handshakes or skylines (POL-050).
- Use Lucide line icons in a light brand-blue tile.

## Voice on screen

- Plain and brief. Say what happens and when.
- No prices or add-ons on lead pages. Fees are quoted after the conflict check.
- Never invite matter details before the conflict check clears.
