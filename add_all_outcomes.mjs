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

async function addOutcomes() {
  const { data: projects, error } = await supabase.from('projects').select('ticket_id, project_name, outcomes');
  if (error) return console.error(error);
  
  for (const p of projects) {
    if (!p.outcomes || p.outcomes.length === 0) {
      const outcomes = [
        { id: `o1-${Date.now()}`, description: `Dramatically improved efficiency for ${p.project_name}.` },
        { id: `o2-${Date.now()}`, description: `Automated key workflows to save manual processing time.` },
        { id: `o3-${Date.now()}`, description: `Provided scalable foundations for future team growth.` }
      ];
      await supabase.from('projects').update({ outcomes }).eq('ticket_id', p.ticket_id);
      console.log(`Added outcomes to ${p.project_name}`);
    } else {
        console.log(`Skipped ${p.project_name}, already has outcomes.`);
    }
  }
  console.log("Done");
}
addOutcomes();
