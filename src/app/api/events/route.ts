import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAccessCode } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      title,
      description, 
      date, 
      startDate,
      location, 
      locationName,
      organizerName, 
      organizerEmail, 
      coverColor,
      password,
    } = body;

    const eventTitle = title || name;
    const eventStartDate = startDate || date;

    if (!eventTitle || !eventStartDate || !organizerName) {
      return NextResponse.json(
        { error: "Title, start date, and organizer name are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Get current user if available
    const { data: { user } } = await supabase.auth.getUser();

    let eventCode = generateAccessCode();
    
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title: eventTitle,
        description: description || null,
        start_date: new Date(eventStartDate).toISOString(),
        location_name: locationName || location || null,
        organizer_id: user?.id || null,
        organizer_name: organizerName,
        organizer_email: organizerEmail || null,
        cover_color: coverColor || "#6366f1",
        event_code: eventCode.toUpperCase(),
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating event:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Auto-join the organizer
    if (user) {
      await supabase.from("event_members").insert({
        event_id: event.id,
        user_id: user.id,
        role: "organizer",
        guest_name: organizerName,
      });
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Event code is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("event_code", code.toUpperCase())
      .single();

    if (error || !event) {
      return NextResponse.json(
        { error: "Event not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event." },
      { status: 500 }
    );
  }
}
