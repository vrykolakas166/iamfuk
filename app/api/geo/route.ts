import { geolocation, ipAddress } from "@vercel/functions";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  //DEBUG START: checking incoming request
  console.log("Headers:", request.headers);
  console.log("IP:", ipAddress(request));
  //DEBUG END: checking incoming request

  const { city } = geolocation(request);

  return NextResponse.json({ city });
}
