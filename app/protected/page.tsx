import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { MenuClient } from "./menu-client";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/access");
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <MenuClient />
    </div>
  );
}
