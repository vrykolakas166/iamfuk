import { geolocation } from "@vercel/functions";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const { city } = geolocation(request);

  return NextResponse.json({ city });
}
