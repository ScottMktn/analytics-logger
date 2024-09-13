// app/api/log-event/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();
  const apiKey = request.headers.get("authorization")?.split("Bearer ")[1];

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  try {
    // Fetch the user ID based on the API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api_keys")
      .select("user_id")
      .eq("key", apiKey)
      .single();

    if (apiKeyError || !apiKeyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const userId = apiKeyData.user_id;

    // Prepare the event data
    const eventData = {
      ...body,
      api_key: apiKey,
      user_id: userId,
    };

    // Insert the event into the analytics_events table
    const { error: insertError } = await supabase
      .from("analytics_events")
      .insert(eventData);

    if (insertError) {
      console.error("Error inserting event:", insertError);
      return NextResponse.json(
        { error: "Failed to log event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
