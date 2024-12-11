import { createClient } from "@/utils/supabase/server";
import AboutPageClient from "./client";

const fetchTechstacks = async () => {
  const supabase = await createClient();
  const { data: techstacks, error } = await supabase
    .from("techstacks")
    .select("*");

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return techstacks || [];
};

const AboutPage = async () => {
  const techstacks = await fetchTechstacks();

  return <AboutPageClient techstacks={techstacks} />;
};

export default AboutPage;
