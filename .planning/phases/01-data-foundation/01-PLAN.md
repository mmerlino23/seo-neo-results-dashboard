---
plan: "01-scaffold"
phase: 1
wave: 1
depends_on: []
requirements: ["DATA-01", "DATA-02", "DATA-03"]
files_modified:
  - package.json
  - tsconfig.json
  - next.config.ts
  - .gitignore
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/globals.css
  - data/SEO NEO TEST 2026.md
autonomous: true
---

# Plan 01: Scaffold Next.js App + Copy Source Data

## Goal

Bootstrap a working Next.js 15 project with Tailwind 4 at the project root and copy the source markdown file into the `data/` directory. After this plan executes, `npm run dev` must start without errors and the source data file must be present at `data/SEO NEO TEST 2026.md`.

## Context

The project directory `D:/ClaudeDev/00_GITHUB/_working-on/Tools/seo-neo-results-dashboard/` currently contains only `.git/` and `.planning/`. Nothing is scaffolded. This plan creates the entire Next.js application skeleton before Plan 02 can add the data layer.

**Stack decisions (locked):**
- Next.js 15 with App Router
- Tailwind 4 (NOT v3 — use `@tailwindcss/vite` or the Tailwind 4 Next.js integration)
- TypeScript strict mode
- Named CSS classes in `globals.css` — NO raw utility classes in TSX components (enforced from day 1)
- No database, no API routes — static data only

## Tasks

<task id="1.1" wave="1">
<title>Initialize Next.js 15 + Tailwind 4 project</title>
<description>
Run `create-next-app` in the project directory to scaffold the Next.js 15 app with TypeScript, App Router, and Tailwind CSS. The directory already has a `.git` folder — do NOT run `git init`. Run the scaffolding command directly in the project root.

**Command to run:**
```bash
cd "D:/ClaudeDev/00_GITHUB/_working-on/Tools/seo-neo-results-dashboard" && npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

Wait — the project uses `src/` directory based on the research architecture. Re-check: the research shows `src/data/`, `src/types/`, `src/lib/`. Use `--src-dir` flag.

**Correct command:**
```bash
cd "D:/ClaudeDev/00_GITHUB/_working-on/Tools/seo-neo-results-dashboard" && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

If `create-next-app` prompts interactively, use the `--yes` flag or pipe yes responses. The goal is a non-interactive scaffolding.

After scaffolding, verify:
- `package.json` exists with `next`, `react`, `react-dom`, `typescript` dependencies
- `src/app/layout.tsx` exists
- `src/app/page.tsx` exists
- `src/app/globals.css` exists
- `tailwind.config.ts` OR Tailwind 4 config exists
- `tsconfig.json` has `strict: true`

**Tailwind 4 note:** `create-next-app` with `--tailwind` as of late 2025 installs Tailwind v4. Verify the installed version by checking `package.json`. If Tailwind v3 was installed instead, upgrade: `npm install tailwindcss@latest @tailwindcss/postcss@latest`. Do NOT use `tailwind.config.js` v3 patterns if Tailwind 4 is installed.

**Clean up the default scaffold:**
- Replace `src/app/page.tsx` with a minimal placeholder (a single `<main>` with "SEO Neo Results Dashboard — Coming Soon")
- Keep `src/app/layout.tsx` but strip all Next.js logo and default content from it — leave just the `<html><body>{children}</body></html>` skeleton
- Keep `src/app/globals.css` but clear all default Tailwind utility classes from it — leave only the Tailwind import directive
</description>
<verification>
- `npm run build` completes without errors from the project root
- `package.json` `dependencies` includes `next` at version 15.x
- `src/app/layout.tsx` exists and is clean (no Next.js default logo/content)
- `src/app/page.tsx` renders a simple placeholder with no errors
- `tsconfig.json` has `"strict": true` in `compilerOptions`
</verification>
</task>

<task id="1.2" wave="1">
<title>Create data/ directory and copy source markdown</title>
<description>
Create a `data/` directory at the project root (NOT inside `src/`) and copy the source markdown file into it.

**Source:** `D:/Download Folder/SEO NEO TEST 2026.md`
**Destination:** `D:/ClaudeDev/00_GITHUB/_working-on/Tools/seo-neo-results-dashboard/data/SEO NEO TEST 2026.md`

The file name must be preserved exactly including spaces. Do not rename it.

**Steps:**
1. Create the directory: `mkdir -p "D:/ClaudeDev/00_GITHUB/_working-on/Tools/seo-neo-results-dashboard/data"`
2. Copy the file: `cp "D:/Download Folder/SEO NEO TEST 2026.md" "D:/ClaudeDev/00_GITHUB/_working-on/Tools/seo-neo-results-dashboard/data/SEO NEO TEST 2026.md"`
3. Verify the copy: `ls -la "D:/ClaudeDev/00_GITHUB/_working-on/Tools/seo-neo-results-dashboard/data/"`

This task is independent of task 1.1 and can run in the same wave. However, task 1.2 must complete before Plan 02's parser is written (the parser references the file path).

**Important:** The source file is at an external location (`D:/Download Folder/`). Copy it — do not symlink. The project must be self-contained.
</description>
<verification>
- `data/SEO NEO TEST 2026.md` exists at the project root level (not inside `src/`)
- File size is greater than 0 bytes
- The filename contains spaces — it was not renamed or cleaned
</verification>
</task>

<task id="1.3" wave="2">
<title>Configure globals.css for Tailwind 4 named class pattern</title>
<description>
Set up `src/app/globals.css` following the Tailwind 4 + named CSS class architecture required by DSGN-04. This establishes the pattern before any components are written so executors in Phase 2 follow it from the start.

**Tailwind 4 import syntax** (NOT v3's `@tailwind base/components/utilities`):
```css
@import "tailwindcss";
```

After the import, add a comment block explaining the naming convention so Phase 2 executors know what's expected:
```css
/*
  Component classes go here using @layer components { ... }
  Use named classes — NO raw utility classes in TSX files.

  Example:
  @layer components {
    .card-wrapper {
      @apply rounded-2xl shadow-xl overflow-hidden;
    }
  }
*/

@layer base {
  :root {
    --font-sans: system-ui, sans-serif;
  }

  body {
    font-family: var(--font-sans);
  }
}
```

Do not add any component classes yet — Phase 2 will populate them. Just establish the structure.

This task depends on task 1.1 completing first (file must exist). Assign to wave 2.
</description>
<verification>
- `src/app/globals.css` contains `@import "tailwindcss"` (Tailwind 4 syntax, not `@tailwind` directives)
- File does not contain raw utility classes as style rules outside of `@apply` blocks
- File contains the `@layer base` block with CSS custom properties
</verification>
</task>

## Must-Haves

Goal-backward from "structured business data is available to drive the entire dashboard":

1. **The Next.js app must build** — `npm run build` passes. If the scaffold is broken, Plan 02 cannot run.
2. **The source markdown must be in `data/`** — Plan 02's parser reads it from `process.cwd()/data/SEO NEO TEST 2026.md`. If missing, the parser will crash at startup.
3. **TypeScript strict mode must be on** — The parser in Plan 02 uses strict TypeScript interfaces. Enabling strict after the fact breaks things.
4. **Tailwind 4 (not v3) must be installed** — Plan 02's CSS classes and Phase 2's design layer depend on Tailwind 4 named class patterns. Installing v3 now and upgrading later causes cascade of changes.

## Verification Criteria

After this plan is complete, ALL of the following must be true:

- [ ] `npm run build` exits with code 0 from `D:/ClaudeDev/00_GITHUB/_working-on/Tools/seo-neo-results-dashboard/`
- [ ] `data/SEO NEO TEST 2026.md` exists at the project root with non-zero size
- [ ] `package.json` shows `next` version 15.x
- [ ] `package.json` shows `tailwindcss` version 4.x
- [ ] `tsconfig.json` has `"strict": true`
- [ ] `src/app/globals.css` uses `@import "tailwindcss"` (Tailwind 4 import, not `@tailwind` directives)
- [ ] `.gitignore` includes `node_modules` and `.next`

## Notes for Executor

- The `.git` directory already exists — do NOT run `git init`
- `create-next-app` may ask about using the Turbopack dev server — accept it (use `--turbopack` flag or accept the default)
- If `create-next-app` fails due to the directory not being empty (it sees `.git` and `.planning`), use the `--force` flag or run with `.` as the target while in the directory
- Do NOT commit anything in this plan — committing is Mike's action
- The `data/` directory is at root, not `src/data/`. This is intentional — `src/data/` will contain TypeScript parser files, `data/` (root) contains the raw source file
