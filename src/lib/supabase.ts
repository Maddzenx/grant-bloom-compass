
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsxzjjleatrbgbuqrcel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeHpqamxlYXRyYmdidXFyY2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTQ1OTksImV4cCI6MjA2NDUzMDU5OX0.er9QQNWB2rlGNH8ApbffPcS14mk39VFyQJ7Ed5ycrG0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
