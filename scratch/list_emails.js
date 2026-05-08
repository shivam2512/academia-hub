import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://crqtzvuzdefyarpqkunm.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycXR6dnV6ZGVmeWFycHFrdW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzczMjkxOCwiZXhwIjoyMDkzMzA4OTE4fQ.j6kW-KmPgQ_dTHBQZmBjniPGWmSicYb8c3jJHQCDehg";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function listAllEmails() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error(error);
    return;
  }
  console.log("Registered Emails:");
  data.users.forEach(u => console.log(`- ${u.email}`));
}

listAllEmails();
