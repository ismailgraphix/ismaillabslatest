-- db/pending/0001_case_study_fields.sql
--
-- NOT APPLIED. Written in Phase 3 of the rebuild; run it only after review,
-- against a database branch first, then production.
--
-- Adds the case-study fields from the rebuild plan to the existing `projects`
-- table, plus a real `slug` column. Until this runs, the site derives each
-- project's URL from its title (slugify() in lib/queries.ts), and the backfill
-- below uses the same rule so existing /work/... URLs do not change.
--
-- Apply all of the following together, in one deploy:
--   1. This SQL (or the matching `drizzle-kit push` after step 2).
--   2. The columns below added to `projects` in db/schema.ts:
--        slug: varchar("slug", { length: 255 }).unique(),
--        client: text("client"),            // name, or an anonymised description
--        sector: varchar("sector", { length: 100 }),
--        year: integer("year"),
--        role: text("role"),                // Ismail Labs' role on the project
--        problem: text("problem"),          // two or three sentences
--        built: text("built"),              // modules, integrations, user roles
--        result: text("result"),            // with at least one number
--        screenshots: jsonb("screenshots").$type<string[]>().notNull().default([]),
--        quote: text("quote"),
--        quoteName: text("quote_name"),
--        quoteRole: text("quote_role"),
--   3. getWork() in lib/queries.ts reading `slug` (falling back to slugify()
--      for rows without one), and the admin projects form and API extended
--      with the new fields.
-- Applying the SQL without step 2 is harmless; deploying step 2 without the
-- SQL breaks every page that reads projects.

BEGIN;

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS slug        varchar(255),
    ADD COLUMN IF NOT EXISTS client      text,
    ADD COLUMN IF NOT EXISTS sector      varchar(100),
    ADD COLUMN IF NOT EXISTS year        integer,
    ADD COLUMN IF NOT EXISTS role        text,
    ADD COLUMN IF NOT EXISTS problem     text,
    ADD COLUMN IF NOT EXISTS built       text,
    ADD COLUMN IF NOT EXISTS result      text,
    ADD COLUMN IF NOT EXISTS screenshots jsonb NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS quote       text,
    ADD COLUMN IF NOT EXISTS quote_name  text,
    ADD COLUMN IF NOT EXISTS quote_role  text;

-- Backfill slugs with the slugify() rule: lowercase, runs of anything other
-- than a-z and 0-9 become "-", leading and trailing "-" removed. Duplicates get
-- "-2", "-3", ... in the order getWork() lists them ("order" desc, created_at desc).
WITH base AS (
    SELECT id,
           COALESCE(NULLIF(trim(BOTH '-' FROM regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')), ''), 'project') AS s,
           "order",
           created_at
    FROM projects
    WHERE slug IS NULL
),
numbered AS (
    SELECT id, s,
           row_number() OVER (PARTITION BY s ORDER BY "order" DESC NULLS LAST, created_at DESC) AS n
    FROM base
)
UPDATE projects p
SET slug = CASE WHEN numbered.n = 1 THEN numbered.s ELSE numbered.s || '-' || numbered.n END
FROM numbered
WHERE p.id = numbered.id;

-- Year defaults to the year the record was created; correct it in the admin
-- where the project was delivered in a different year.
UPDATE projects SET year = EXTRACT(YEAR FROM created_at)::int WHERE year IS NULL;

ALTER TABLE projects ADD CONSTRAINT projects_slug_unique UNIQUE (slug);

COMMIT;

-- Expected slugs for the two projects published on 14 November 2026:
--   "Pathtern(AI Internship Matcher)" -> pathtern-ai-internship-matcher
--   "Scoop and Dreams"                -> scoop-and-dreams
