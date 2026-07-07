import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key.trim()] = val.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const userNames = [
    'Pavan C',
    'Sunil Morries',
    'Vinaykumar B Kandibal',
    'Abhay P A',
    'Adarsh Jayaraj',
    'Dhigin Chanikya',
    'mohammad.rahil' // in db it's Mohammad Rahil, so I will match carefully
  ];

  const { data: usersData } = await supabase.from('users').select('*');
  const userMap = {};
  if (usersData) {
    usersData.forEach(u => {
      userMap[u.display_name.toLowerCase()] = u.user_id;
    });
  }

  const { data: lokkerData } = await supabase.from('lokker').select('*').eq('category', 'type');
  const types = lokkerData || [];
  const automationType = types.find(l => l.label.toLowerCase() === 'automation') || { id: 1 };
  const biType = types.find(l => l.label.toLowerCase() === 'dashboards' || l.label.toLowerCase() === 'data insights') || { id: 2 };

  const projects = [];

  for (const requestedUser of userNames) {
    const formattedUser = requestedUser.toLowerCase().replace('mohammad.rahil', 'mohammad rahil');
    const userId = userMap[formattedUser] || null;

    for (let i = 0; i < 3; i++) {
      const isAuto = i % 2 === 0;
      projects.push({
        project_name: isAuto ? `Automation Workflow ${i+1}` : `Data Analytics Dashboard ${i+1}`,
        project_description: isAuto 
          ? `Automating the manual process for ${requestedUser}'s team to reduce errors.`
          : `Providing real-time BI insights for ${requestedUser}'s department.`,
        problem_statement: isAuto
          ? `The manual process takes 10 hours a week and is prone to errors.`
          : `Stakeholders don't have visibility into live data.`,
        type_looker_id: isAuto ? automationType.id : biType.id,
        is_published: true,
        ticket_id: (isAuto ? 'AUTO-' : 'BI-') + Math.floor(Math.random() * 90000 + 10000),
        submitter_name: 'System Admin',
        submitter_email: 'admin@abiteam.com',
        objectives_scope: 'Streamline operations.',
        assigned_user_id: userId
      });
    }
  }

  const { error } = await supabase.from('projects').insert(projects);
  
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log(`Successfully inserted ${projects.length} projects!`);
    
    const metrics = projects.map(p => ({
      ticket_id: p.ticket_id,
      tools_used: 'n8n, Python, SQL',
      process_time_before: '5 hours',
      process_time_after: '1 minute',
      process_before: 'Very manual and tedious.',
      process_after: 'Fully automated.',
      total_hours_saved: Math.floor(Math.random() * 500 + 100),
      optimization_rate: 90
    }));

    await supabase.from('project_metrics').insert(metrics);
    console.log('Metrics seeded successfully.');
  }
}

seed();
