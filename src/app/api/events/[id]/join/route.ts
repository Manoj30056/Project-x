import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    // Join logic with visibility
    if (event.visibility === "hidden") {
      return NextResponse.json(
        { error: "This event is not accessible." },
        { status: 403 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { data: member, error: joinError } = await supabase
      .from("event_members")
      .insert({
        event_id: id,
        user_id: user?.id || null,
        guest_name: name,
        role: "guest",
        is_guest_account: !user,
      })
      .select()
      .single();

    if (joinError) {
      console.error("Join error:", joinError);
      return NextResponse.json({ error: joinError.message }, { status: 500 });
    }

    // Update guest count
    await supabase.rpc('increment_guest_count', { event_id: id });

    return NextResponse.json({ guest: member }, { status: 201 });
  } catch (error) {
    console.error("Failed to join event:", error);
    return NextResponse.json(
      { error: "Failed to join event." },
      { status: 500 }
    );
  }
}
