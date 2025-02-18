import { createClient } from "@/utils/supabase/server";
import MyNavbar from "./my-navbar";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <MyNavbar user={user} />;
}
