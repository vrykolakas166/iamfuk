import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex gap-2 items-center sm:gap-4">
      <Link href="/projects">Projects</Link>
      <Link href="/about">About</Link>
      {user ? (
        <form action={signOutAction}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      ) : (
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Access</Link>
        </Button>
      )}
    </div>
  );
}
