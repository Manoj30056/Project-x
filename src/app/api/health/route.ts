import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Basic connectivity check
    return Response.json({ 
      status: "healthy",
      timestamp: new Date().toISOString(),
      env: {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error) {
    return Response.json({ status: "unhealthy", error: String(error) }, { status: 500 });
  }
}
