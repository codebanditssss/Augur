
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
    console.log('Testing market insertion...');
    const { data, error } = await supabase
        .from('markets')
        .insert({
            title: 'Test Market ' + Date.now(),
            description: 'Test Description',
            category: 'general',
            status: 'active',
            total_yes_volume: 0,
            total_no_volume: 0,
            total_traders: 0
        })
        .select()
        .single();

    if (error) {
        console.error('Insert Error:', error);
    } else {
        console.log('Insert Success:', data);
    }
}

testInsert();
