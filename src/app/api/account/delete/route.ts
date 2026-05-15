import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user } } = await authSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const email = user.email?.toLowerCase() || "";

    // 1. Delete API keys
    await supabaseAdmin.from("api_keys").delete().eq("user_id", userId);

    // 2. Delete scans for user's QR codes
    const { data: qrCodes } = await supabaseAdmin
      .from("qr_codes")
      .select("id")
      .eq("user_id", userId);

    if (qrCodes && qrCodes.length > 0) {
      const qrIds = qrCodes.map((q: { id: string }) => q.id);
      await supabaseAdmin.from("scans").delete().in("qr_code_id", qrIds);
    }

    // 3. Delete QR codes
    await supabaseAdmin.from("qr_codes").delete().eq("user_id", userId);

    // 4. Delete subscriptions
    await supabaseAdmin.from("subscriptions").delete().eq("user_id", userId);

    // 5. Delete coupon activations
    if (email) {
      await supabaseAdmin.from("coupon_activations").delete().eq("email", email);
    }

    // 6. Delete auth user (requires service role)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error("[Delete] auth delete error:", deleteError.message);
      return NextResponse.json({ error: "Failed to delete account: " + deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    console.error("[Delete] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
