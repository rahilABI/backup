-- ══════════════════════════════════════════════════════
--  CLEAN DROP: Remove all existing tables & functions
-- ══════════════════════════════════════════════════════
DROP TABLE IF EXISTS public.metrics  CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.users    CASCADE;
DROP TABLE IF EXISTS public.lookup   CASCADE;
DROP FUNCTION IF EXISTS check_image_urls(text[]);

-- ══════════════════════════════════════════════════════
--  TABLE 1: lookup
--  Stores all dropdown values (status, domain, type, etc.)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.lookup (
  id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label     VARCHAR(100) NOT NULL,
  category  VARCHAR(100) NOT NULL,
  user_id   UUID,
  updated_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

-- ══════════════════════════════════════════════════════
--  TABLE 2: users
--  Stores user profile info (maps to Supabase auth.users)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.users (
  id            UUID PRIMARY KEY,
  name          VARCHAR(150),
  email_id      VARCHAR(255) UNIQUE NOT NULL,
  department_id INT REFERENCES public.lookup(id),
  role_id       INT REFERENCES public.lookup(id),
  updated_by    UUID REFERENCES public.users(id),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ
);

-- Add the lookup -> users Foreign Key (done after users table is created)
ALTER TABLE public.lookup
  ADD CONSTRAINT fk_lookup_user
  FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.lookup
  ADD CONSTRAINT fk_lookup_updated_by
  FOREIGN KEY (updated_by) REFERENCES public.users(id);

-- ══════════════════════════════════════════════════════
--  HELPER FUNCTION: Validate image-only URLs in array
-- ══════════════════════════════════════════════════════
CREATE FUNCTION check_image_urls(urls text[])
RETURNS boolean AS $$
DECLARE
  url text;
BEGIN
  IF urls IS NULL THEN RETURN true; END IF;
  FOREACH url IN ARRAY urls LOOP
    IF url NOT ILIKE '%.png'   AND
       url NOT ILIKE '%.jpg'   AND
       url NOT ILIKE '%.jpeg'  AND
       url NOT ILIKE '%.gif'   AND
       url NOT ILIKE '%.webp'  THEN
      RETURN false;
    END IF;
  END LOOP;
  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ══════════════════════════════════════════════════════
--  TABLE 3: projects
--  Core table for every automation request.
--  Primary Key = Jira ticket_id (set by n8n on form submit)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.projects (
  ticket_id         VARCHAR(15)   PRIMARY KEY,
  project_name      VARCHAR(255),
  problem_statement TEXT,
  current_process   TEXT,
  updated_process   TEXT,
  user_id           UUID          REFERENCES public.users(id),
  domain_id         INT           REFERENCES public.lookup(id),
  project_type_id   INT           REFERENCES public.lookup(id),
  status_id         INT           REFERENCES public.lookup(id),
  attachments       TEXT[]        CHECK (check_image_urls(attachments)),
  is_published      BOOLEAN       DEFAULT false,
  updated_by        UUID          REFERENCES public.users(id),
  created_at        TIMESTAMPTZ   DEFAULT now(),
  updated_at        TIMESTAMPTZ
);

-- ══════════════════════════════════════════════════════
--  TABLE 4: metrics
--  Stores measurable outcomes tied to a completed project
-- ══════════════════════════════════════════════════════
CREATE TABLE public.metrics (
  id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_ticket VARCHAR(15)  REFERENCES public.projects(ticket_id),
  lookup_id      INT          REFERENCES public.lookup(id),
  value          INT,
  updated_by     UUID         REFERENCES public.users(id),
  created_at     TIMESTAMPTZ  DEFAULT now(),
  updated_at     TIMESTAMPTZ
);

-- ══════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════
ALTER TABLE public.lookup   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics  ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published projects (for the public website)
CREATE POLICY "Public can read projects"
  ON public.projects FOR SELECT USING (is_published = true);

-- Allow anyone to read lookup values (for dropdowns)
CREATE POLICY "Public can read lookup"
  ON public.lookup FOR SELECT USING (true);
