import { createClient } from "@/utils/supabase/client";
export const revalidate = 60;
export async function GET() {
  try {
    const supabase = createClient();
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*");
    if (error) {
      console.log("Could not fetch projects data.");
    } else {
      return Response.json(projects);
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
}
