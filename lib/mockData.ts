export type Ticket = {
    ticket_id: string;
    created_at: string;
    name: string;
    email: string;
    department: string;
    problem_statement: string;
    objective_scope: string;
    project_process: string;
    stakeholders: string;
    data_sources: string;
    status: string;
    meeting_timeline: any[];
    project_name: string;
    project_solution: string;
    type: string;
    publish: boolean;
};

export const MOCK_TICKETS: Ticket[] = [
    {
        ticket_id: '1',
        created_at: new Date().toISOString(),
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        department: 'Operations',
        problem_statement: 'Need a way to track global node throughput in real-time.',
        objective_scope: 'Build a unified dashboard for operations.',
        project_process: 'Currently tracking in 5 separate Excel files.',
        stakeholders: 'Operations Team, IT',
        data_sources: 'N8N, SAP, AWS',
        status: 'Deployment',
        meeting_timeline: [
            { time: '2026-05-01', synopsis: 'Initial scoping session.' },
            { time: '2026-05-15', synopsis: 'Design approval.' }
        ],
        project_name: 'Nexus Performance Matrix',
        project_solution: 'A unified telemetry interface aggregating real-time throughput metrics across global server nodes, enabling predictive scaling.',
        type: 'dashboard',
        publish: true
    },
    {
        ticket_id: '2',
        created_at: new Date().toISOString(),
        name: 'John Smith',
        email: 'john@example.com',
        department: 'Finance',
        problem_statement: 'Vendor onboarding takes 3 weeks due to manual compliance checks.',
        objective_scope: 'Automate vendor background checks and form generation.',
        project_process: 'Manual email threads and PDF parsing.',
        stakeholders: 'Finance, Legal',
        data_sources: 'Emails, Docusign',
        status: 'Users Feedback',
        meeting_timeline: [],
        project_name: 'Automated Vendor Onboarding',
        project_solution: 'Streamlines the compliance and credentialing process for Tier 1 suppliers, reducing cycle time by 40% through intelligent routing.',
        type: 'workflow',
        publish: true
    },
    {
        ticket_id: '3',
        created_at: new Date().toISOString(),
        name: 'Alice Vance',
        email: 'alice@example.com',
        department: 'Marketing',
        problem_statement: 'No central repository for brand assets and form templates.',
        objective_scope: 'Create a self-serve documentation portal.',
        project_process: 'Slack requests to design team.',
        stakeholders: 'Marketing, Design',
        data_sources: 'Google Drive',
        status: 'Problem Discovery',
        meeting_timeline: [],
        project_name: '',
        project_solution: '',
        type: '',
        publish: false
    }
];
