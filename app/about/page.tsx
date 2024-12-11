import { createClient } from "@/utils/supabase/client";
import AboutPageClient from "./client";

const fetchTechstacks = async () => {
  const supabase = createClient();
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
  var techstacks = await fetchTechstacks();

  return <AboutPageClient techstacks={techstacks} />;
};

export default AboutPage;
