-- ══════════════════════════════════════════════════════
--  COMPREHENSIVE TEST DATA SEED SCRIPT
--  Populates data with realistic, detailed content for all fields.
-- ══════════════════════════════════════════════════════

-- 1. Insert Comprehensive Lookup Data
INSERT INTO public.lookup (id, category, label, created_at, updated_at) OVERRIDING SYSTEM VALUE VALUES
-- Departments (101-106)
(101, 'department', 'IT Support', NOW(), NOW()),
(102, 'department', 'Human Resources', NOW(), NOW()),
(103, 'department', 'Finance', NOW(), NOW()),
(104, 'department', 'Engineering', NOW(), NOW()),
(105, 'department', 'Operations', NOW(), NOW()),
(106, 'department', 'Marketing', NOW(), NOW()),

-- Domains (107-108)
(107, 'domain', 'BI', NOW(), NOW()),
(108, 'domain', 'Automation', NOW(), NOW()),

-- Roles (109-110)
(109, 'role', 'user', NOW(), NOW()),
(110, 'role', 'stakeholder', NOW(), NOW()),

-- Project Types (111-114)
(111, 'project_type', 'Workflow Automation', NOW(), NOW()),
(112, 'project_type', 'Data Migration', NOW(), NOW()),
(113, 'project_type', 'System Integration', NOW(), NOW()),
(114, 'project_type', 'Reporting & Analytics', NOW(), NOW()),

-- Status (115-116)
(115, 'status', 'problem request', NOW(), NOW()),
(116, 'status', 'done', NOW(), NOW()),

-- Metrics (117-120)
(117, 'metric', 'Hours Saved per Month', NOW(), NOW()),
(118, 'metric', 'Cost Savings (USD)', NOW(), NOW()),
(119, 'metric', 'Error Rate Reduction (%)', NOW(), NOW()),
(120, 'metric', 'Processing Time (Mins)', NOW(), NOW());

-- Reset sequence for lookup table
SELECT setval(pg_get_serial_sequence('public.lookup', 'id'), coalesce(max(id), 121)) FROM public.lookup;

-- 2. Insert Realistic Users Data
-- System Admin UUID
INSERT INTO public.users (id, name, email_id, department_id, role_id, created_at, updated_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'System Admin', 'admin@example.com', 101, 110, NOW(), NOW()),
('3f8d9b1a-2e4c-5f6a-7b8c-9d0e1f2a3b4c', 'Alex Mercer', 'alex.m@company.com', 103, 109, NOW(), NOW()),
('7c8e9d0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a', 'Jordan Lee', 'jordan.l@company.com', 104, 110, NOW(), NOW()),
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Taylor Smith', 'taylor.s@company.com', 106, 109, NOW(), NOW());

-- 3. Update lookup and users with updated_by and user_id fields
UPDATE public.lookup 
SET user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
    updated_by = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

UPDATE public.users 
SET updated_by = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- 4. Insert Detailed Projects Data
INSERT INTO public.projects (
  ticket_id, project_name, problem_statement, current_process, updated_process, 
  user_id, domain_id, project_type_id, status_id, attachments, is_published, 
  updated_by, created_at, updated_at
) VALUES
(
  'ABI-001', 
  'Monthly Finance Dashboard', 
  'Finance team lacks visibility into real-time spend because data is manually compiled from various sources.', 
  'Analysts pull CSVs from 3 different systems at the end of every month and use complex Excel macros to generate reports.', 
  'Implemented an automated pipeline that ingests data directly into a PowerBI dashboard, providing real-time insights.', 
  '3f8d9b1a-2e4c-5f6a-7b8c-9d0e1f2a3b4c', 
  107, -- BI
  114, -- Reporting & Analytics
  116, -- done
  ARRAY['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'], 
  true, 
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '5 days'
),
(
  'ABI-002', 
  'Onboarding Auto-Emails', 
  'HR sends manual welcome and training schedule emails to every new hire, which is tedious and error-prone.', 
  'HR staff individually writes emails and attaches PDFs based on the department the new hire is joining.', 
  'An n8n automation triggers when a new employee is added to Workday, sending a personalized email sequence automatically.', 
  '7c8e9d0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a', 
  108, -- Automation
  111, -- Workflow Automation
  116, -- done
  NULL, 
  true, 
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '2 days'
),
(
  'ABI-003', 
  'Sales Data Pipeline', 
  'Salesforce data is not integrated with the main data warehouse, causing discrepancies in performance reviews.', 
  'Data engineers run a manual export from Salesforce weekly and upload it to the warehouse.', 
  'Set up a real-time data streaming pipeline to keep Salesforce and the warehouse perfectly synced.', 
  '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 
  107, -- BI
  113, -- System Integration
  115, -- problem request
  ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'], 
  false, 
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '10 days'
);

-- 5. Insert Realistic Metrics Data
INSERT INTO public.metrics (project_ticket, lookup_id, value, updated_by, created_at, updated_at) VALUES
-- Metrics for ABI-001
('ABI-001', 117, 25, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '4 days', NOW()),
('ABI-001', 119, 95, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '4 days', NOW()),

-- Metrics for ABI-002
('ABI-002', 117, 60, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '9 days', NOW()),
('ABI-002', 118, 1500, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '9 days', NOW()),

-- Metrics for ABI-003
('ABI-003', 120, 30, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '2 days', NOW());
