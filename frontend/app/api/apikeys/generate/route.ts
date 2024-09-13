// app/api/apikeys/generate/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const apiKey = `ak_${crypto.randomBytes(24).toString("hex")}`;

  const { data, error } = await supabase
    .from("api_keys")
    .insert({ user_id: user.id, key: apiKey });

  if (error) {
    return NextResponse.json(
      { error: "Failed to generate API key" },
      { status: 500 }
    );
  }

  return NextResponse.json({ apiKey });
}
