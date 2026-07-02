# Become a Trainer Page — Design

**Date:** 2026-07-02
**Status:** Approved by user
**Project:** client-tatugacamp (Next.js 14 pages router, Tailwind, Sanity v3)

## Purpose

A public, English-only recruitment page at `/become-a-trainer` targeting travelers
and freelancers (native or non-native English speakers) who want short-term
experience teaching English to Thai students at Tatuga Camp. The page gathers
information for visitors, shows social proof via profiles of past trainers
(managed in Sanity), highlights that Tatuga Camp supports travel costs and hotel
accommodation, and drives visitors to contact via existing channels
(no application form).

## Decisions made

- **Contact method:** contact links only (Facebook, Instagram, TikTok, phone
  061-027-7960, email tatugacamp@gmail.com) — no form, no backend.
- **Route:** `/become-a-trainer`.
- **Trainer profile fields:** picture, name, title, nationality, description,
  feedback quote. No join-date or video fields (YAGNI).
- **Navigation:** add a "Become a Trainer" link to the main navbar (desktop and
  mobile menus) next to the existing About Us link.
- **Approach:** new `trainer` Sanity document type; page copy hardcoded in
  English in the page component (Approach A). Rejected: fully CMS-driven page
  copy (inconsistent with rest of site); reusing `members` schema (tangles team
  page with trainer testimonials).

## Sanity content model

New document type `trainer` in `sanity/schemas/trainer.ts`, registered in
`sanity/schema.ts`:

| Field | Type | Required | Purpose |
|---|---|---|---|
| `name` | string | yes | Trainer's name, e.g. "Sarah M." |
| `title` | string | yes | Label under name, e.g. "Freelance teacher from Canada" |
| `nationality` | string | yes | Country name shown as a badge on the card |
| `description` | text | yes | A few sentences about their time at the camp |
| `feedback` | text | yes | Their quote, displayed as a testimonial |
| `mainImage` | image (hotspot) | yes | Their photo |

Validation follows the existing `members` schema pattern
(`Rule.required().min(1).warning(...)`).

Supporting files, mirroring the `members` pattern exactly:

- `sanity/sanity-models/trainer.model.ts` — `Trainer` TypeScript model,
  exported from `sanity/sanity-models/index.ts`.
- `sanity/services/trainer.ts` — `GetTrainersSanityService()` GROQ fetch of all
  published `trainer` documents ordered by creation date, exported from
  `sanity/services/index.ts`.

Content editors add one document per trainer in Sanity Studio (`/sanity`):
upload photo, fill in text, publish.

## Page structure (`pages/become-a-trainer/index.tsx`)

Rendered inside `HomepageLayout` (announcement bar + main navbar). All copy in
English. Theme: Poppins font, `main-color` #2C7CD1 headings, `second-color`
#F85C00 / `third-color` #EDB901 accents, decorative blob SVGs as on about-us.
Data via `getStaticProps`.

Sections top to bottom:

1. **Hero** — headline "Teach English at a Thai Camp" (or similar) with subline
   addressed to travelers and freelancers: native or non-native speakers
   welcome, short-time commitment, real classroom experience with Thai
   students. "Contact Us" button scrolls to the contact section.
2. **Who we're looking for** — three cards (travelers exploring Thailand,
   freelancers between projects, anyone wanting first teaching experience),
   each with a short blurb and a `react-icons` icon.
3. **What we support** — visually emphasized block (e.g. `second-color`
   background): travel cost support, hotel/accommodation for overstays, no
   formal teaching certificate required.
4. **Trainers who joined us** — Sanity-driven. Cards with photo, name, title,
   nationality badge, description, feedback quote styled as a testimonial.
   Grid on `lg`+; Swiper carousel with autoplay below `lg` (same responsive
   pattern as members on about-us). Section does not render at all when no
   trainers are published.
5. **Contact CTA** — "Ready to join us?" with the same contact links and social
   SVG components used on about-us.

SEO: English meta tags (title, description, Open Graph) targeting phrases like
"teach English in Thailand short term volunteer camp".

## Components

- `components/become-a-trainer/TrainerCard.tsx` — renders one trainer profile
  (photo via existing `urlFor` helper from `sanity/lib/image.ts` with Next
  `<Image>`, name, title, nationality badge, description, feedback quote).
- Static sections (hero, who-we're-looking-for, support, contact) live directly
  in the page file, matching the about-us pattern.

## Navigation change

`components/navbars/mainNavbar.tsx`: add a "Become a Trainer" link to both the
desktop link row and the mobile menu, alongside the existing About Us link.

## Data flow

Build time → `getStaticProps` → `GetTrainersSanityService()` → GROQ query →
`trainers: Trainer[]` props → page render. New trainers appear after the next
build/revalidation, same as the members list.

## Error handling / edge cases

- **No trainers published:** the trainers section is skipped entirely — no
  empty grid or broken carousel. The page can launch before the first trainer
  document exists.
- **Missing image:** schema marks `mainImage` required; card assumes it exists
  (same assumption as `CardProfile` on about-us).

## Verification

- `next build` completes without errors.
- Dev server: `/become-a-trainer` renders; navbar link works at desktop and
  mobile widths; trainers section hidden with zero documents and renders cards
  once a trainer is published.
- Sanity Studio at `/sanity` shows the new "trainer" document type and accepts
  a test document.
