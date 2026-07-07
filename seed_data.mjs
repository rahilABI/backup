import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://puldsducltztmxkajdnd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WHfZNO9sdjWpDSgJkVK8Rw_a13Qd0Dk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const departmentsList = [
    "Algo", "Software", "Medical", "QA", "Hardware", "QARA", "Marketing", "Human Resource", 
    "Customer Success", "Order Management", "Finance & Accounts", "Inside Sales", "Customer Support", 
    "Management", "Inventory & Logistics", "Admin & Facility", "Product & Design", "Channel Management", 
    "IT", "Product Operations", "Tools and Analytics", "SRE", "DE", "Echo Sales", "Sales - SME", 
    "Digital Health", "Installation & Service", "Government Business", "Sales - LE", "Malaysia Business", 
    "Africa Business", "Philippines Business", "Automation & Business Intelligence", "Clinical Research Division", 
    "Draft", "Business Ops", "New Business Initiatives"
];

async function seedData() {
    console.log("Connecting to Supabase...");
    
    // 1. Fetch existing lokker to avoid dupes
    const { data: existingLokker, error: fetchErr } = await supabase.from('lokker').select('*');
    if (fetchErr) throw fetchErr;

    const existingDepts = existingLokker.filter(l => l.category === 'department').map(l => l.label);
    const newDepts = departmentsList.filter(d => !existingDepts.includes(d));

    // 2. Insert new departments
    if (newDepts.length > 0) {
        const toInsert = newDepts.map(d => ({ category: 'department', label: d }));
        console.log(`Inserting ${toInsert.length} new departments...`);
        const { error: insErr } = await supabase.from('lokker').insert(toInsert);
        if (insErr) throw insErr;
    } else {
        console.log("Departments already up to date.");
    }

    // Refresh lokker data
    const { data: freshLokker } = await supabase.from('lokker').select('*');
    const { data: users } = await supabase.from('users').select('*');

    const getLokkerId = (cat, lbl) => {
        const l = freshLokker.find(x => x.category === cat && x.label === lbl);
        return l ? l.id : null;
    };
    const getUserId = (email) => {
        const u = users.find(x => x.email === email);
        return u ? u.user_id : null;
    };

    // 3. Insert Sample Stakeholders
    const stakeholders = [
        { name: "John Doe", email: "john.doe@example.com", department: "Software" },
        { name: "Jane Smith", email: "jane.smith@example.com", department: "Medical" }
    ];
    const { data: insertedStakeholders } = await supabase.from('stakeholders')
        .upsert(stakeholders, { onConflict: 'email' })
        .select('stakeholder_id');

    // 4. Sample Projects Data
    const projects = [
        {
            ticket_id: "MOCK-101",
            submitter_name: "Test Submitter",
            submitter_email: "test@example.com",
            department_looker_id: getLokkerId('department', 'Software') || getLokkerId('department', 'AI & Data'),
            problem_statement: "Legacy code base experiencing high technical debt leading to frequent build failures.",
            objectives_scope: "Refactor core modules",
            assigned_user_id: getUserId('adarsh@tricog.com'),
            status_looker_id: getLokkerId('status', 'Development'),
            project_name: "Project Phoenix - Codebase Modernization",
            type_looker_id: getLokkerId('type', 'Applications'),
            project_description: "Migrating from legacy class components to React hooks and implementing strict TypeScript typings.",
            is_published: true
        },
        {
            ticket_id: "MOCK-204",
            submitter_name: "Test Submitter",
            submitter_email: "test@example.com",
            department_looker_id: getLokkerId('department', 'Automation & Business Intelligence'),
            problem_statement: "Lack of centralized reporting limits leadership visibility into operational metrics.",
            objectives_scope: "Create unified dashboard",
            assigned_user_id: getUserId('sarah@tricog.com'),
            status_looker_id: getLokkerId('status', 'testing'),
            project_name: "OmniSight Dashboard",
            type_looker_id: getLokkerId('type', 'Dashboards'),
            project_description: "Developing a single pane of glass dashboard aggregating cross-departmental KPIs.",
            is_published: true
        },
        {
            ticket_id: "MOCK-305",
            submitter_name: "Test Submitter",
            submitter_email: "test@example.com",
            department_looker_id: getLokkerId('department', 'QA'),
            problem_statement: "Manual regression testing takes over 4 days, delaying release cycles.",
            objectives_scope: "Automate E2E testing",
            assigned_user_id: getUserId('aravind@tricog.com'),
            status_looker_id: getLokkerId('status', 'Solution'),
            project_name: "QA Automation Framework",
            type_looker_id: getLokkerId('type', 'Automation'),
            project_description: "Implementing Cypress for all frontend repositories.",
            is_published: false
        },
        {
            ticket_id: "MOCK-408",
            submitter_name: "Test Submitter",
            submitter_email: "test@example.com",
            department_looker_id: getLokkerId('department', 'Product & Design'),
            problem_statement: "User churn during onboarding flow has increased by 15% this quarter.",
            objectives_scope: "Revamp onboarding UX",
            assigned_user_id: getUserId('dmitri@tricog.com'),
            status_looker_id: getLokkerId('status', 'design'),
            project_name: "Onboarding Flow Revamp 2.0",
            type_looker_id: getLokkerId('type', 'Websites'),
            project_description: "Streamlining the sign-up process and introducing an interactive tutorial.",
            is_published: true
        },
        {
            ticket_id: "MOCK-512",
            submitter_name: "Test Submitter",
            submitter_email: "test@example.com",
            department_looker_id: getLokkerId('department', 'IT'),
            problem_statement: "Unexpected AWS billing spikes during non-peak hours.",
            objectives_scope: "Audit AWS infrastructure",
            assigned_user_id: getUserId('chloe@tricog.com'),
            status_looker_id: getLokkerId('status', 'Problem Discovery'),
            project_name: "AWS Cost Optimization",
            type_looker_id: getLokkerId('type', 'Workflow'),
            project_description: "Identifying unused resources and optimizing EC2 instances.",
            is_published: false
        }
    ];

    console.log("Inserting sample projects...");
    for (const p of projects) {
        // Use upsert or checking
        const { data: ex } = await supabase.from('projects').select('ticket_id').eq('ticket_id', p.ticket_id);
        if (ex && ex.length > 0) {
            await supabase.from('projects').update(p).eq('ticket_id', p.ticket_id);
        } else {
            await supabase.from('projects').insert([p]);
        }
    }

    if (insertedStakeholders) {
        console.log("Linking stakeholders...");
        for (const p of projects) {
            for (const s of insertedStakeholders) {
                // Ignore errors on duplicate inserts for many-to-many
                await supabase.from('project_stakeholders').insert([{
                    ticket_id: p.ticket_id,
                    stakeholder_id: s.stakeholder_id
                }]);
            }
        }
    }

    console.log("Seed data injected successfully!");
}

seedData().catch(console.error);
