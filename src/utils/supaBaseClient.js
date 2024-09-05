// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://avvwzxwxqyyhxfixtopz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dnd6eHd4cXl5aHhmaXh0b3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzNzg2MjYsImV4cCI6MjA0MDk1NDYyNn0.aOMymTZPghtvMLT_mvawVKvkPwVHml1fF7PUGX_35o0";

export const supabase = createClient(supabaseUrl, supabaseKey);
