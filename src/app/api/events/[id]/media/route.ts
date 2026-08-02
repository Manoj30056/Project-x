import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const guestId = formData.get("guestId") as string | null;
    const guestName = formData.get("guestName") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `${id}/${filename}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(file.type.startsWith("video/") ? "event-videos" : "event-photos")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from(file.type.startsWith("video/") ? "event-videos" : "event-photos")
      .getPublicUrl(filePath);

    const isVideo = file.type.startsWith("video/");
    const table = isVideo ? "videos" : "photos";
    
    const { data: mediaRecord, error: dbError } = await supabase
      .from(table)
      .insert({
        event_id: id,
        uploader_id: guestId || null,
        uploader_name: guestName || "Anonymous",
        original_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Increment media count
    await supabase.rpc('increment_media_count', { event_id: id });

    return NextResponse.json({ media: { ...mediaRecord, type: isVideo ? "video" : "image" } }, { status: 201 });
  } catch (error) {
    console.error("Failed to upload media:", error);
    return NextResponse.json(
      { error: "Failed to upload media." },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: eventPhotos } = await supabase
      .from("photos")
      .select("*")
      .eq("event_id", id);

    const { data: eventVideos } = await supabase
      .from("videos")
      .select("*")
      .eq("event_id", id);

    const combinedMedia = [
      ...(eventPhotos || []).map(p => ({ ...p, type: "image" as const })),
      ...(eventVideos || []).map(v => ({ ...v, type: "video" as const }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ media: combinedMedia });
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media." },
      { status: 500 }
    );
  }
}
