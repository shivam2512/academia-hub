import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://crqtzvuzdefyarpqkunm.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycXR6dnV6ZGVmeWFycHFrdW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzczMjkxOCwiZXhwIjoyMDkzMzA4OTE4fQ.j6kW-KmPgQ_dTHBQZmBjniPGWmSicYb8c3jJHQCDehg";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function listAllUsers() {
  let allUsers = [];
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) break;
    allUsers = allUsers.concat(data.users);
    if (data.users.length < 1000) break;
    page++;
  }
  
  console.log("Registered Emails:");
  allUsers.forEach(u => console.log(`- ${u.email}`));
  
  const target = "shivamshinde786@gmail.com";
  const user = allUsers.find(u => u.email === target);
  if (user) {
     const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
     console.log(`Roles for ${target}:`, roles.map(r => r.role));
  } else {
     console.log(`${target} NOT FOUND in ${allUsers.length} users.`);
  }
}

listAllUsers();
