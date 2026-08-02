import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    // Return a dummy client if keys are missing to prevent crash during build/init
    return createBrowserClient(
      "https://dkttvyjumsocvunoiysl.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdHR2eWp1bXNvY3Z1bm9peXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0MTYwMDAsImV4cCI6MjA0MTYwMDAwMH0.placeholder" // Using a dummy JWT format
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
