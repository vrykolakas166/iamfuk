import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const city = request.headers.get("X-User-City") || "Hanoi";

  return NextResponse.json({ city });
}
