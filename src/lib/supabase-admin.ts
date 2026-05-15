import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function createAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not set. Admin client will fail at runtime.");
    return createClient("https://localhost", "placeholder") as ReturnType<typeof createClient>;
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

export const supabaseAdmin = createAdminClient();
