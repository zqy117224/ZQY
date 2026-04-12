# VCE Pathway Compass

A small MVP web app for Australian students, VCE students, international students, and families comparing university majors and career pathways.

This version uses manually entered, source-backed data for a small set of representative majors. It does not provide guaranteed admission advice, guaranteed salary outcomes, migration advice, or financial advice.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Local source-backed data
- No database
- No login
- No payment
- No external API integration

## How To Run Locally

First install Node.js LTS from the official Node.js website if you do not already have `node` and `npm`.

Then run:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful commands:

```bash
npm run dev
npm run build
npm run lint
```

## Pages

- `/` - Home page
- `/questionnaire` - Student questionnaire
- `/results` - Ranked recommendations from simple local scoring rules
- `/comparison` - Side-by-side major comparison
- `/consultation` - Placeholder consultation/contact page

## Folder Structure

```text
src/
  app/
    comparison/page.tsx       Side-by-side comparison page
    consultation/page.tsx     Placeholder consultation page
    questionnaire/page.tsx    Questionnaire form
    results/page.tsx          Recommendation results page
    globals.css               Tailwind and shared global styles
    layout.tsx                Shared navigation and page shell
    page.tsx                  Home page
  data/
    majors.ts                 Source-backed major data
  lib/
    recommendations.ts        Questionnaire parsing and scoring logic
```

## Important Files

`src/data/majors.ts`

Stores all majors. Edit this file when you want to add, remove, or change a major. Each major separates university-specific `go8Entries`, `graduateOutcomes`, `occupationOutcomes`, and `scoringProfile`. Go8 entries include university, course name, ATAR value, ATAR type, year, subject requirements, requirement type, source link, and last checked date.

`src/lib/recommendations.ts`

Contains the readable rules-based scoring logic. Edit this file when you want to change how answers affect recommendations.

`src/app/questionnaire/page.tsx`

Contains the questionnaire fields. Add or remove form fields here.

`src/app/results/page.tsx`

Displays ranked recommendations, explanations, warnings, salary ranges, work style, working hours, and job environment.

`src/app/comparison/page.tsx`

Displays the side-by-side comparison table. Add rows to `comparisonRows` if you want to compare more criteria.

## How The Recommendation Logic Works

The scoring is intentionally simple:

- Matching prerequisite subjects increases the score.
- Missing important prerequisite subjects reduces the score.
- Strong subjects increase matching pathways.
- Weak subjects reduce matching pathways.
- High maths or physics interest improves maths-heavy and engineering pathways.
- Low coding interest reduces software and data-related pathways.
- High salary preference improves higher salary-potential pathways.
- Strong lifestyle preference improves pathways with better work-life balance scores.
- Disliking remote or FIFO work reduces mining-related pathways.
- Preference for technical or people-facing work changes the ranking.

The logic is not AI. It is a beginner-friendly weighted scoring system that is easy to inspect and edit.

## Data Reminder

The data is manually entered from representative source pages. Prerequisites can differ by university, course, campus, year, student type, and selection pathway. Verify every decision against official course pages, admissions pages, labour-market data, graduate outcome sources, and expert review.

## Version 2 Ideas

- Add real university course and prerequisite data.
- Add filters by state, university, ATAR range, and student type.
- Add Chinese-language content or bilingual mode.
- Add saved comparison lists.
- Add a proper enquiry form backend.
- Add analytics to see which pathways users compare most.
- Add source citations and last-updated dates for real data.
