import { createClient } from '@supabase/supabase-js'

// URL Database Mas (Dari screenshot sebelumnya)
const supabaseUrl = 'https://rzzfaalrjojhlvjddvzl.supabase.co'

// Paste Key yang barusan dicopy di sini
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6emZhYWxyam9qaGx2amRkdnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDg1MDksImV4cCI6MjA3OTM4NDUwOX0.3mqw3in19X5W5VU_YMM6LE_gbS9IqZJQzxvH_nj6O7w' 

export const supabase = createClient(supabaseUrl, supabaseKey)