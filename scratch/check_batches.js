import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://crqtzvuzdefyarpqkunm.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycXR6dnV6ZGVmeWFycHFrdW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzczMjkxOCwiZXhwIjoyMDkzMzA4OTE4fQ.j6kW-KmPgQ_dTHBQZmBjniPGWmSicYb8c3jJHQCDehg";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkBatches() {
  const { data: batches } = await supabase
    .from('batches')
    .select('id, name');
    
  console.log("All Batches:");
  for (const b of batches) {
    const { count } = await supabase
      .from('batch_members')
      .select('*', { count: 'exact', head: true })
      .eq('batch_id', b.id);
    console.log(`- ${b.name} (ID: ${b.id}): ${count} members`);
  }
}

checkBatches();
