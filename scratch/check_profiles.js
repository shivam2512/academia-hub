import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://crqtzvuzdefyarpqkunm.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycXR6dnV6ZGVmeWFycHFrdW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzczMjkxOCwiZXhwIjoyMDkzMzA4OTE4fQ.j6kW-KmPgQ_dTHBQZmBjniPGWmSicYb8c3jJHQCDehg";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkData() {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
    
  console.log(`Total Profiles: ${count}`);
  
  const { data: recent } = await supabase
    .from('profiles')
    .select('email, full_name')
    .ilike('email', '%dummy.com%')
    .limit(5);
    
  console.log("Recent Dummy Profiles:", recent);
}

checkData();
