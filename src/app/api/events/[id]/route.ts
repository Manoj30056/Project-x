import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const { data: members } = await supabase
      .from("event_members")
      .select("*")
      .eq("event_id", id);

    const { data: eventPhotos } = await supabase
      .from("photos")
      .select("*")
      .eq("event_id", id);

    const { data: eventVideos } = await supabase
      .from("videos")
      .select("*")
      .eq("event_id", id);

    // Combine media for the gallery
    const combinedMedia = [
      ...(eventPhotos || []).map(p => ({ ...p, type: "image" as const })),
      ...(eventVideos || []).map(v => ({ ...v, type: "video" as const }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      event,
      guests: members || [], 
      media: combinedMedia,
    });
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event." },
      { status: 500 }
    );
  }
}
