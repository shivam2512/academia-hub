import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://crqtzvuzdefyarpqkunm.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycXR6dnV6ZGVmeWFycHFrdW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzczMjkxOCwiZXhwIjoyMDkzMzA4OTE4fQ.j6kW-KmPgQ_dTHBQZmBjniPGWmSicYb8c3jJHQCDehg";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkRoles() {
  const { count } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact', head: true });
    
  console.log(`Total User Roles: ${count}`);
}

checkRoles();
