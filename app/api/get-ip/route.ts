import { NextRequest, NextResponse } from "next/server";

// app/api/get-ip/route.ts
export async function GET(req: NextRequest) {
  // Check if the environment is development
  if (process.env.NEXT_PUBLIC_APP_ENV === "dev") {
    // In development, return a fixed local IP (like 127.0.0.1 or localhost)
    const currResponse = await fetch("https://api.ipify.org/?format=json");
    const res = await currResponse.json();

    return NextResponse.json(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // In production
  // Extract the IP address from the 'x-forwarded-for' header
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : req.headers.get("cf-connecting-ip") || "Unknown IP";

  return NextResponse.json({ ip });
}
