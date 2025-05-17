import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientLayout from "./client-layout";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/access");
  }

  return <ClientLayout user={user}>{children}</ClientLayout>;
} 