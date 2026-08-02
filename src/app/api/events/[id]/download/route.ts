import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, media } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const eventMedia = await db
      .select()
      .from(media)
      .where(eq(media.eventId, id));

    // Return list of downloadable URLs
    // In production, this could generate a ZIP file
    const downloads = eventMedia.map((m) => ({
      id: m.id,
      url: m.url,
      filename: `engram-${event.title.toLowerCase().replace(/\s+/g, "-")}-${m.id}.${m.type === "video" ? "mp4" : "jpg"}`,
      type: m.type,
      uploadedBy: m.guestName,
    }));

    return NextResponse.json({
      event: {
        id: event.id,
        name: event.title,
      },
      mediaCount: eventMedia.length,
      downloads,
    });
  } catch (error) {
    console.error("Failed to prepare download:", error);
    return NextResponse.json(
      { error: "Failed to prepare download." },
      { status: 500 }
    );
  }
}
