-- ABI Portal Supabase Schema
-- IMPORTANT: Run this entire script in your Supabase SQL Editor.
-- Ensure that you have enabled Google Auth in your Supabase Auth Providers setting.

-- 1. Create Lookup Data Table (Submerges Department, Type, and Status)
CREATE TABLE IF NOT EXISTS public.lookup_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR NOT NULL CHECK (category IN ('DEPARTMENT', 'TYPE', 'STATUS')),
    value VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Lookup Data
INSERT INTO public.lookup_data (category, value) VALUES 
('STATUS', 'Problem statement'),
('STATUS', 'Problem Discovery'),
('STATUS', 'Solution design'),
('STATUS', 'Development'),
('STATUS', 'Testing'),
('STATUS', 'Deployment'),
('STATUS', 'Users feedback'),
('DEPARTMENT', 'Operations'),
('DEPARTMENT', 'Finance'),
('DEPARTMENT', 'Human Resources'),
('DEPARTMENT', 'Marketing'),
('TYPE', 'Automation'),
('TYPE', 'Business Intelligence'),
('TYPE', 'Web App')
ON CONFLICT DO NOTHING;

-- 2. Create Users Profile Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR,
    display_name VARCHAR,
    role VARCHAR DEFAULT 'Team Member' CHECK (role IN ('Manager', 'Team Member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'Team Member'); -- Default to Team Member
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. Create or Modify Tickets Table
-- (If you already have a tickets table, you might need to ALTER it instead, 
-- but here is the comprehensive CREATE TABLE schema).
CREATE TABLE IF NOT EXISTS public.tickets (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR,
    client_email VARCHAR,
    
    -- Form fields from the Query Page
    problem_statement TEXT NOT NULL,
    objectives_scope TEXT NOT NULL,
    project_process TEXT NOT NULL,
    stakeholders_context TEXT,
    data_sources TEXT NOT NULL,
    
    -- Fields populated by Manager/Dashboard
    project_name VARCHAR,
    project_description TEXT,
    
    -- Foreign Keys for Lookups
    lookup_department_id UUID REFERENCES public.lookup_data(id),
    lookup_type_id UUID REFERENCES public.lookup_data(id),
    lookup_status_id UUID REFERENCES public.lookup_data(id),
    
    -- Assignments & States
    assigned_to UUID REFERENCES public.users(id),
    publish BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
-- Managers can see all tickets. Team members can see tickets assigned to them.
CREATE POLICY "Manager View All, Members View Assigned" ON public.tickets
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'Manager' OR 
    assigned_to = auth.uid() OR 
    publish = true -- Public users can see published tickets
  );
  
CREATE POLICY "Manager and Assignees can update" ON public.tickets
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'Manager' OR 
    assigned_to = auth.uid()
  );

CREATE POLICY "Anyone can insert a ticket (Query Form)" ON public.tickets
  FOR INSERT WITH CHECK (true);


-- 4. Create Stakeholders Table
CREATE TABLE IF NOT EXISTS public.stakeholders (
    stakeholder_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(ticket_id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);

-- 5. Create Meetings Table
CREATE TABLE IF NOT EXISTS public.meetings (
    meeting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(ticket_id) ON DELETE CASCADE,
    synopsis TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    document_url VARCHAR,
    created_by UUID REFERENCES public.users(id)
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manager and Assignees can view/edit meetings" ON public.meetings
  FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.tickets t 
        WHERE t.ticket_id = meetings.ticket_id 
        AND ((SELECT role FROM public.users WHERE id = auth.uid()) = 'Manager' OR t.assigned_to = auth.uid())
    )
  );

-- Function to auto-update updated_at column on tickets
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tickets_modtime ON public.tickets;
CREATE TRIGGER update_tickets_modtime
BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
