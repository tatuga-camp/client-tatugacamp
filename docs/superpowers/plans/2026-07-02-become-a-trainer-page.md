# Become a Trainer Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A public English-only page at `/become-a-trainer` recruiting travelers/freelancers as English camp trainers, with trainer profiles managed in Sanity.

**Architecture:** New Sanity document type `trainer` following the existing schema → model → service pattern (mirror of `members`). New Next.js page (pages router) rendered in `HomepageLayout` with `getStaticProps`, static English copy in the component, and a Sanity-driven testimonial section. A `TrainerCard` component renders each profile. Navbar gets a "Become a Trainer" link.

**Tech Stack:** Next.js 14 (pages router), TypeScript, Tailwind (custom colors `main-color` #2C7CD1, `second-color` #F85C00, `third-color` #EDB901; fonts `font-Poppins`, `font-Inter`), Sanity v3 (embedded studio at `/sanity`), Swiper, react-icons.

**Spec:** `docs/superpowers/specs/2026-07-02-become-a-trainer-page-design.md`

## Global Constraints

- All page copy in English only.
- Contact channels (verbatim from about-us): Facebook/Instagram/TikTok/Google name "Tatuga Camp", phone "061-027-7960", email "tatugacamp@gmail.com".
- No application form, no new backend endpoints, no new dependencies.
- Trainer fields exactly: `name`, `title`, `nationality`, `description`, `feedback`, `mainImage`. No join-date or video fields.
- **No test framework exists in this repo.** Verification per task = `npm run lint` (and `npm run build` at the end) plus manual dev-server checks. Do NOT add jest/vitest.
- All commands run from repo root `client-tatugacamp/`. Dev server: `npm run dev` → http://localhost:8080.
- Working directory note: the repo root is `C:\Users\perml\coding\tatuga-camp\client-tatugacamp` (the parent folder is NOT a git repo).

---

### Task 1: Sanity `trainer` schema

**Files:**
- Create: `sanity/schemas/trainer.ts`
- Modify: `sanity/schema.ts`

**Interfaces:**
- Consumes: `defineType` from `sanity` (existing pattern in `sanity/schemas/members.ts`).
- Produces: document type named `"trainer"` with fields `name`, `title`, `nationality` (string), `description`, `feedback` (text), `mainImage` (image with hotspot). Task 2's GROQ query and model depend on these exact field names.

- [ ] **Step 1: Create the schema file**

Create `sanity/schemas/trainer.ts`:

```ts
import { defineType } from "sanity";

export default defineType({
  name: "trainer",
  title: "trainer",
  type: "document",
  fields: [
    {
      name: "name",
      title: "name",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "title",
      title: "title",
      type: "string",
      description: "e.g. Freelance teacher from Canada",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "nationality",
      title: "nationality",
      type: "string",
      description: "Country name shown as a badge, e.g. Canada",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "description",
      title: "description",
      type: "text",
      description: "A few sentences about their time at the camp",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "feedback",
      title: "feedback",
      type: "text",
      description: "Their quote about joining us, shown as a testimonial",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().warning("must upload a photo"),
    },
  ],
});
```

- [ ] **Step 2: Register the schema**

In `sanity/schema.ts`, add the import after the `thanksSchools` import (line 15):

```ts
import trainer from "./schemas/trainer";
```

and add `trainer,` to the `types` array after `thanksSchools,`:

```ts
    thanksSchools,
    trainer,
    whatsNews,
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: exits 0 with no output (same as before the change — run it once before editing if unsure of the baseline).

- [ ] **Step 4: Verify the studio loads the type**

Run `npm run dev`, open http://localhost:8080/sanity — the document list must show a "trainer" type. Create (but you may discard) a draft to confirm all 6 fields render. Stop the dev server after.

- [ ] **Step 5: Commit**

```bash
git add sanity/schemas/trainer.ts sanity/schema.ts
git commit -m "feat: add trainer document type to Sanity schema"
```

---

### Task 2: Trainer model and fetch service

**Files:**
- Create: `sanity/sanity-models/trainer.model.ts`
- Create: `sanity/services/trainer.ts`
- Modify: `sanity/sanity-models/index.ts`
- Modify: `sanity/services/index.ts`

**Interfaces:**
- Consumes: `sanityClient` from `sanity/lib/client`; the `"trainer"` document type from Task 1.
- Produces: `Trainer` type and `GetTrainersSanityService(): Promise<Trainer[]>`, both exported from the barrels — Tasks 3 and 4 import `{ Trainer }` from `../../sanity/sanity-models` and `{ GetTrainersSanityService }` from `../../sanity/services`.

- [ ] **Step 1: Create the model**

Create `sanity/sanity-models/trainer.model.ts`:

```ts
export type Trainer = {
  name: string;
  title: string;
  nationality: string;
  description: string;
  feedback: string;
  mainImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
  };
};
```

- [ ] **Step 2: Create the service**

Create `sanity/services/trainer.ts` (same shape as `sanity/services/member.ts`):

```ts
import { sanityClient } from "../lib/client";
import { Trainer } from "../sanity-models";

type ResponseGetTrainersSanityService = Trainer[];

export async function GetTrainersSanityService(): Promise<ResponseGetTrainersSanityService> {
  try {
    const query = `*[_type == "trainer"] | order(_createdAt asc){
        mainImage{
            asset->{
                    url,
                    metadata
                  }
            },
        name,
        title,
        nationality,
        description,
        feedback,
      }`;
    const trainers = await sanityClient.fetch(query);
    return trainers;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

- [ ] **Step 3: Export from barrels**

Append to `sanity/sanity-models/index.ts`:

```ts
export * from "./trainer.model";
```

Append to `sanity/services/index.ts`:

```ts
export * from "./trainer";
```

- [ ] **Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add sanity/sanity-models/trainer.model.ts sanity/services/trainer.ts sanity/sanity-models/index.ts sanity/services/index.ts
git commit -m "feat: add Trainer model and GetTrainersSanityService"
```

---

### Task 3: TrainerCard component

**Files:**
- Create: `components/become-a-trainer/TrainerCard.tsx`

**Interfaces:**
- Consumes: `Trainer` from `../../sanity/sanity-models` (Task 2); `DoubleQuote` from `../svgs/social_logo/doubleQuote` (exists — used by `components/card-about-us/CardProfile.tsx`).
- Produces: default export `TrainerCard`, props `{ trainer: Trainer }`. Task 4 renders `<TrainerCard trainer={trainer} />`.

- [ ] **Step 1: Create the component**

Create `components/become-a-trainer/TrainerCard.tsx`:

```tsx
import React from "react";
import Image from "next/image";
import DoubleQuote from "../svgs/social_logo/doubleQuote";
import { Trainer } from "../../sanity/sanity-models";

type TrainerCardProps = {
  trainer: Trainer;
};

function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <div className="flex h-full w-full max-w-sm flex-col items-center rounded-2xl bg-white p-6 shadow-md">
      <div className="relative h-40 w-40 overflow-hidden rounded-full">
        <Image
          src={trainer.mainImage?.asset?.url}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={trainer.mainImage?.asset?.metadata?.lqip}
          alt={`picture of ${trainer.name}`}
          sizes="160px"
        />
      </div>
      <h3 className="mt-4 text-center font-Poppins text-xl font-semibold text-main-color">
        {trainer.name}
      </h3>
      <span className="text-center font-Poppins text-sm font-medium text-gray-700">
        {trainer.title}
      </span>
      <span className="mt-2 rounded-full bg-third-color px-3 py-1 text-xs font-semibold text-white">
        {trainer.nationality}
      </span>
      <p className="mt-3 text-center text-sm text-gray-600">
        {trainer.description}
      </p>
      <div className="relative mt-auto w-full pt-4">
        <div className="absolute left-0 top-2 max-w-[15px]">
          <DoubleQuote />
        </div>
        <p className="p-4 text-center text-sm italic text-gray-800">
          {trainer.feedback}
        </p>
        <div className="absolute bottom-0 right-0 max-w-[15px]">
          <DoubleQuote />
        </div>
      </div>
    </div>
  );
}

export default TrainerCard;
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/become-a-trainer/TrainerCard.tsx
git commit -m "feat: add TrainerCard component"
```

---

### Task 4: The /become-a-trainer page

**Files:**
- Create: `pages/become-a-trainer/index.tsx`
- Modify: `pages/sitemap.xml.ts:5-10` (add route to `STATIC_PATHS`)

**Interfaces:**
- Consumes: `GetTrainersSanityService` (Task 2), `Trainer` (Task 2), `TrainerCard` (Task 3), `HomepageLayout` from `../../layouts/homePageLayout`, `SEOHead` from `../../components/seo/SEOHead`, social SVGs from `../../components/svgs/social_logo/*`, blobs `Blob3`/`Blob4` from `../../components/svgs/blobs/big-blobs/*`, Swiper (same usage as `pages/about-us/index.tsx`), icons from `react-icons/fa`.
- Produces: the page route `/become-a-trainer`.

- [ ] **Step 1: Create the page**

Create `pages/become-a-trainer/index.tsx`:

```tsx
import React from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import {
  FaPlaneDeparture,
  FaLaptop,
  FaChalkboardTeacher,
  FaHotel,
  FaCheckCircle,
} from "react-icons/fa";
import HomepageLayout from "../../layouts/homePageLayout";
import SEOHead from "../../components/seo/SEOHead";
import TrainerCard from "../../components/become-a-trainer/TrainerCard";
import { GetTrainersSanityService } from "../../sanity/services";
import { Trainer } from "../../sanity/sanity-models";
import Facebook from "../../components/svgs/social_logo/Facebook";
import Instagram from "../../components/svgs/social_logo/Instagram";
import Tiktok from "../../components/svgs/social_logo/Tiktok";
import Phone from "../../components/svgs/social_logo/Phone";
import Mail from "../../components/svgs/social_logo/Mail";
import Blob3 from "../../components/svgs/blobs/big-blobs/blob3";
import Blob4 from "../../components/svgs/blobs/big-blobs/blob4";

const lookingFor = [
  {
    icon: <FaPlaneDeparture />,
    title: "Travelers",
    description:
      "Exploring Thailand and want to do something meaningful along the way? Join a camp for a few days and leave a real mark.",
  },
  {
    icon: <FaLaptop />,
    title: "Freelancers",
    description:
      "Between projects or working remotely? Step away from the screen and spend a short time teaching and playing with Thai students.",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "First-time teachers",
    description:
      "Curious about teaching English? Our camps are a friendly, supported way to get your first classroom experience.",
  },
];

const Index = ({ trainers }: { trainers: Trainer[] }) => {
  const contacts = {
    name: "Tatuga Camp",
    phone: "061-027-7960",
    email: "tatugacamp@gmail.com",
  };

  const contactCSS =
    "text-[0.7rem] md:text-[0.8rem] lg:text-xl mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium";

  return (
    <HomepageLayout>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <SEOHead />
        <Head>
          <title>Become a Trainer - Teach English at a Thai Camp</title>
          <meta
            name="title"
            content="Become a Trainer - Teach English at a Thai Camp | Tatuga Camp"
          />
          <meta
            name="description"
            content="Native or non-native English speakers welcome! Join Tatuga Camp as a short-term English camp trainer in Thailand. We support travel costs and hotel. Perfect for travelers and freelancers who want real teaching experience with Thai students."
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Become a Trainer - Teach English at a Thai Camp | Tatuga Camp"
          />
          <meta
            property="og:description"
            content="Native or non-native English speakers welcome! Join Tatuga Camp as a short-term English camp trainer in Thailand. We support travel costs and hotel."
          />
          <meta
            property="og:image"
            content="https://storage.googleapis.com/tatugacamp.com/thumnail/WordCloud.app.jpg"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="600" />
          <meta
            name="keywords"
            content="teach English in Thailand, English camp trainer, short term teaching Thailand, volunteer English teacher, Tatuga Camp, teach Thai students, travel and teach"
          />
          <meta
            name="viewport"
            content="width=device-width; initial-scale=1.0;"
          />
          <meta charSet="UTF-8" />
        </Head>

        <main className="relative mb-10 mt-10 flex h-max w-full max-w-7xl flex-col items-center justify-start px-4 font-Poppins md:mt-0 md:px-10">
          {/* Hero */}
          <section className="mt-20 flex w-full flex-col items-center px-4 text-center md:px-20">
            <h1 className="text-4xl font-semibold leading-tight text-main-color md:text-5xl lg:text-7xl">
              Teach English at a Thai Camp
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-medium md:text-xl">
              Native or non-native English speaker — you are welcome. Join
              Tatuga Camp for a short time, teach English to Thai students
              through games and activities, and make memories that last a
              lifetime.
            </p>
            <a href="#contact" className="no-underline">
              <button className="mt-6 cursor-pointer rounded-full border-0 bg-second-color px-8 py-3 font-Poppins text-base font-semibold text-white transition duration-150 hover:bg-main-color md:text-xl">
                Contact Us
              </button>
            </a>
          </section>

          {/* Who we're looking for */}
          <section className="mt-16 w-full md:mt-24">
            <h2 className="text-center text-2xl font-semibold text-main-color md:text-4xl">
              Who we are looking for
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {lookingFor.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-main-color text-2xl text-white">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold md:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 md:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* What we support */}
          <section className="mt-16 w-full rounded-3xl bg-second-color p-8 text-white md:mt-24 md:p-12">
            <h2 className="text-center text-2xl font-semibold md:text-4xl">
              We take care of you
            </h2>
            <ul className="mt-8 grid list-none grid-cols-1 gap-6 pl-0 md:grid-cols-3">
              <li className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl">
                  <FaPlaneDeparture />
                </span>
                <span className="mt-3 text-lg font-semibold">
                  Travel cost support
                </span>
                <span className="mt-1 text-sm md:text-base">
                  We support your travel costs to the camp.
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl">
                  <FaHotel />
                </span>
                <span className="mt-3 text-lg font-semibold">
                  Hotel included
                </span>
                <span className="mt-1 text-sm md:text-base">
                  Need to stay overnight? We arrange and cover your hotel.
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl">
                  <FaCheckCircle />
                </span>
                <span className="mt-3 text-lg font-semibold">
                  No certificate needed
                </span>
                <span className="mt-1 text-sm md:text-base">
                  No formal teaching certificate required — just energy and a
                  love of working with kids.
                </span>
              </li>
            </ul>
          </section>

          {/* Trainers who joined us */}
          {trainers.length > 0 && (
            <section className="mt-16 w-full md:mt-24">
              <h2 className="text-center text-2xl font-semibold text-main-color md:text-4xl">
                Trainers who joined us
              </h2>
              <p className="mt-2 text-center text-sm font-medium md:text-base">
                Hear it from the travelers and freelancers who already taught
                with us.
              </p>

              {/* upper 1024px: grid */}
              <div className="mt-8 hidden lg:grid lg:grid-cols-3 lg:justify-items-center lg:gap-8">
                {trainers.map((trainer, index) => (
                  <TrainerCard key={index} trainer={trainer} />
                ))}
              </div>

              {/* lower 1024px: carousel */}
              <div className="mt-8 lg:hidden">
                <Swiper
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination, Autoplay]}
                >
                  {trainers.map((trainer, index) => (
                    <SwiperSlide key={index}>
                      <div className="flex justify-center pb-10">
                        <TrainerCard trainer={trainer} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          )}

          {/* Contact CTA */}
          <section
            id="contact"
            className="mt-16 flex w-full flex-col items-center md:mt-24"
          >
            <h2 className="text-center text-2xl font-semibold text-main-color md:text-4xl">
              Ready to join us?
            </h2>
            <p className="mt-2 max-w-2xl text-center text-sm font-medium md:text-base">
              Send us a message on any channel below and tell us when you are
              traveling in Thailand — we will find a camp that fits your plans.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-10 md:gap-x-20">
              <ul className="flex list-none flex-col pl-0">
                <li className={contactCSS}>
                  <Facebook />
                  {contacts.name}
                </li>
                <li className={contactCSS}>
                  <Instagram />
                  {contacts.name}
                </li>
                <li className={contactCSS}>
                  <Tiktok />
                  {contacts.name}
                </li>
              </ul>
              <ul className="flex list-none flex-col pl-0">
                <li className={contactCSS}>
                  <Phone />
                  {contacts.phone}
                </li>
                <li className={contactCSS}>
                  <Mail />
                  {contacts.email}
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* Blob */}
      <div className="absolute left-0 top-[60rem] z-0 w-8/12">
        <Blob4 />
      </div>
      <div className="absolute right-0 top-0 z-0 w-7/12">
        <Blob3 />
      </div>
    </HomepageLayout>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const trainers = await GetTrainersSanityService();
  return {
    props: {
      trainers,
    },
  };
};
```

- [ ] **Step 2: Add the route to the sitemap**

In `pages/sitemap.xml.ts`, add `"/become-a-trainer"` to `STATIC_PATHS`:

```ts
const STATIC_PATHS = [
  "",
  "/about-us",
  "/become-a-trainer",
  "/games/taboo",
  "/teacher-tools/timer",
];
```

- [ ] **Step 3: Verify types compile and lint passes**

Run: `npx tsc --noEmit`
Expected: exits 0.

Run: `npm run lint`
Expected: "✔ No ESLint warnings or errors" (or the same pre-existing warnings as before this change, none of them in the new files).

- [ ] **Step 4: Verify in the dev server**

Run `npm run dev`, open http://localhost:8080/become-a-trainer and check:
- Page renders with hero, three "who we are looking for" cards, orange support block, and contact section.
- "Contact Us" button scrolls to the contact section.
- With zero published trainers, no "Trainers who joined us" heading appears and nothing is broken.
- (Optional, if a test trainer document was published in Task 1) trainer cards render in a grid at ≥1024px width and as a swipeable carousel below 1024px.
- http://localhost:8080/sitemap.xml includes `/become-a-trainer`.

Stop the dev server after.

- [ ] **Step 5: Commit**

```bash
git add pages/become-a-trainer/index.tsx pages/sitemap.xml.ts
git commit -m "feat: add /become-a-trainer recruitment page"
```

---

### Task 5: Navbar links

**Files:**
- Modify: `components/navbars/mainNavbar.tsx:121-128` (mobile menu) and `components/navbars/mainNavbar.tsx:180-186` (desktop menu)

**Interfaces:**
- Consumes: the page route `/become-a-trainer` (Task 4); existing `Link` import and CSS classes already present in the file.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the mobile menu entry**

In `components/navbars/mainNavbar.tsx`, directly after the `about us` mobile `<Link>` block (the one wrapping `href="/about-us"`, ends line 128), insert:

```tsx
            <Link className="no-underline" href="/become-a-trainer">
              <li
                onClick={onClick}
                className="w-60 bg-white text-center rounded-md text-black  py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                become a trainer
              </li>
            </Link>
```

- [ ] **Step 2: Add the desktop menu entry**

In the same file, directly after the desktop `about us` `<li>` block (the one containing `href="/about-us"` inside the `hidden md:flex` list, ends line 186), insert:

```tsx
          <li className="">
            <Link className="no-underline" href="/become-a-trainer">
              <button className="focus:outline-none md:text-xs lg:text-base text-black font-Inter font-normal  border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]">
                <span>become a trainer</span>
              </button>
            </Link>
          </li>
```

- [ ] **Step 3: Verify in the dev server**

Run `npm run dev`, open http://localhost:8080 and check:
- Desktop width (≥768px): "become a trainer" appears next to "about us" and navigates to the page.
- Narrow width (<768px): open the hamburger menu — "become a trainer" appears under "about us", navigates, and the menu closes on tap.

Stop the dev server after.

- [ ] **Step 4: Commit**

```bash
git add components/navbars/mainNavbar.tsx
git commit -m "feat: add become-a-trainer link to main navbar"
```

---

### Task 6: Full build verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: everything from Tasks 1–5.
- Produces: confidence.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build completes with `✓ Generating static pages` and `/become-a-trainer` listed in the route table as `● (SSG)` or `○` — no build errors. (`getStaticProps` calls Sanity at build time; network access to Sanity's API is required, same as the existing about-us page.)

- [ ] **Step 2: Final manual sweep**

Run `npm run dev` and re-check the three URLs: `/become-a-trainer`, `/` (navbar links at both widths), `/sanity` (trainer type present). Stop the server.

- [ ] **Step 3: Commit any stragglers**

Run: `git status --short`
Expected: clean. If anything is uncommitted, commit it with an appropriate `feat:`/`chore:` message.
