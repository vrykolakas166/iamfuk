import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Get geolocation
  const country = request.headers.get("x-vercel-ip-country") || "Unknown";
  const region = request.headers.get("x-vercel-ip-country-region") || "Unknown";
  const city = request.headers.get("x-vercel-ip-city") || "Unknown";

  console.log(`User Location: ${city}, ${region}, ${country}`);

  // Assign location
  response.headers.set("X-User-City", city);
  response.headers.set("X-User-Region", region);
  response.headers.set("X-User-Country", country);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
