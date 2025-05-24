import { createClient } from "@/utils/supabase/server";
import ProjectPageClient from "./client";

const fetchProjects = async () => {
  const supabase = await createClient();
  const { data: projects, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return projects || [];
};

const ProjectPage = async () => {
  const projects = await fetchProjects();

  // Pass the fetched projects to the Client Component
  return <ProjectPageClient projects={projects} />;
};

export default ProjectPage;
