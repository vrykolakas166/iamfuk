import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  // Handle OAuth errors (like user cancellation)
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(`${origin}/access?error=${error}`);
  }

  // Handle successful OAuth flow
  if (code) {
    try {
      const supabase = await createClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(`${origin}/access?error=auth_error`);
    }
  }

  // Redirect to the specified URL or default to protected page
  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`);
}
