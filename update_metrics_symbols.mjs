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

async function updateMetrics() {
  const { data: projects, error } = await supabase.from('projects').select('ticket_id, custom_metrics, type_looker_id');
  if (error) return console.error(error);

  const { data: metricsData } = await supabase.from('project_metrics').select('*');

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    
    // 1. Clean up custom metrics and randomize amount
    let newCustomMetrics = [];
    
    // Give random mix based on index
    const numCustom = (i % 3) + 1; // 1 to 3 custom metrics
    
    const possibleCustoms = [
      { name: "Report Gen Time", value: "1 min" },
      { name: "Page Load Speed", value: "0.8s" },
      { name: "Manual Steps Removed", value: "10" },
      { name: "Revenue Boost", value: "$49K" },
      { name: "Bounce Rate Drop", value: "13%" }
    ];
    
    // Pick first 'numCustom' ones, rotated by index
    for (let j = 0; j < numCustom; j++) {
        newCustomMetrics.push(possibleCustoms[(i + j) % possibleCustoms.length]);
    }
    
    // If index % 4 == 0, no custom metrics (to ensure mix)
    if (i % 4 === 0) {
        newCustomMetrics = [];
    }

    await supabase.from('projects').update({ custom_metrics: newCustomMetrics }).eq('ticket_id', p.ticket_id);

    // 2. Clean up impact metrics (project_metrics table)
    const metric = metricsData.find(m => m.ticket_id === p.ticket_id);
    if (metric) {
      let updateData = {};
      
      const hasImpact = (i % 3) !== 0; // Most have impact metrics, some don't
      
      if (hasImpact) {
          // ensure a mix of impact metrics
          updateData = {
              total_hours_saved: (i * 50) % 300 > 0 ? (i * 50) % 300 : null,
              data_visibility_improved: (i % 5) + 2, // 2 to 6
              optimization_rate: 70 + (i % 25),
              adoption_rate: null, // intentionally null some to create mix
              security_rate: (i % 2 === 0) ? 90 + (i % 10) : null,
              sla_compliance: (i % 3 === 0) ? 95 + (i % 5) : null
          };
      } else {
          // Clear impact metrics to ensure mix
          updateData = {
              total_hours_saved: null,
              data_visibility_improved: null,
              optimization_rate: null,
              adoption_rate: null,
              security_rate: null,
              sla_compliance: null
          };
      }
      
      // Update the row
      await supabase.from('project_metrics').update(updateData).eq('ticket_id', p.ticket_id);
    }
  }
  
  console.log("Metrics updated without symbols and with mixed amounts.");
}

updateMetrics();
