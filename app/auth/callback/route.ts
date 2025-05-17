import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const DEFAULT_ROLE_UUID = '8b5be904-9f7b-4a68-b80c-28029036c427';

async function assignRoleToUser(userUuidValue: string) {
  const supabase = await createClient();

  // First check if the user already has a role
  const { data: existingRole } = await supabase
    .from('userRoles')
    .select('*')
    .eq('userUuid', userUuidValue)
    .single();

  if (!existingRole) {
    // Only assign role if user doesn't have one
    const { data, error } = await supabase
      .from('userRoles')
      .insert([
        {
          userUuid: userUuidValue,
          roleUuid: DEFAULT_ROLE_UUID
        },
      ])
      .select()

    if (error) {
      console.error('Failed to assign role to user:', error);
      // We don't throw here because the user is already signed in
      // We can handle this error separately if needed
    }
  }
}

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
      const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

      // Assign role to the user if they don't have one
      if (user) {
        await assignRoleToUser(user.id);
      }
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
