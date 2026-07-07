import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('projects').insert([{
        ticket_id: 'TEST-123',
        department_looker_id: 'Software' // Testing the invalid type
    }]);
    console.log("Error inserting with string:", error);

    const { data: d2, error: e2 } = await supabase.from('projects').insert([{
        ticket_id: 'TEST-124',
        department_looker_id: null
    }]);
    console.log("Error inserting with null:", e2);
}

test();
