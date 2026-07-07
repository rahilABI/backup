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

async function updateProjects() {
  const { data: projects, error } = await supabase.from('projects').select('ticket_id, project_name').in('project_name', ['Workflow Auto-Pilot', 'Executive BI Dashboard']);
  
  if (error) {
    console.error("Error fetching projects:", error);
    return;
  }

  for (const p of projects) {
    let outcomes = [];
    if (p.project_name === 'Workflow Auto-Pilot') {
      outcomes = [
        { id: 'o1', description: 'Completely eliminated manual ticket triaging overhead.' },
        { id: 'o2', description: 'Reduced time-to-first-response by 90% during peak hours.' },
        { id: 'o3', description: 'Achieved a near-perfect SLA compliance rate of 99.9%.' }
      ];
    } else if (p.project_name === 'Executive BI Dashboard') {
      outcomes = [
        { id: 'o1', description: 'Provided real-time visibility into global sales and operations.' },
        { id: 'o2', description: 'Eliminated the 5-day lag for end-of-month reporting.' },
        { id: 'o3', description: 'Empowered executives to make data-driven decisions instantly.' }
      ];
    }

    const { error: updateError } = await supabase.from('projects').update({ outcomes }).eq('ticket_id', p.ticket_id);
    if (updateError) {
      console.error(`Failed to update ${p.project_name}:`, updateError);
    } else {
      console.log(`Successfully updated outcomes for ${p.project_name}`);
    }
  }
}

updateProjects();
