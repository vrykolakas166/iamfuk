'use server';

import { getProjects, createProject, updateProject, deleteProject } from '@/utils/supabase/projects';
import { getTechStacks, createTechStack, updateTechStack, deleteTechStack } from '@/utils/supabase/techstacks';
import { getCurrentUserRole } from '@/utils/supabase/roles';
import { createClient } from '@/utils/supabase/client';

// Helper to check admin access
async function checkAdminAccess() {
  const role = await getCurrentUserRole();
  if (!role || role.prority !== 0) {
    throw new Error('Unauthorized: Admin access required');
  }
}

// Project Actions
export async function getProjectsAction() {
  await checkAdminAccess();
  return getProjects();
}

export async function createProjectAction(project: {
  image: string;
  title: string;
  description: string;
  scope: string;
  team_size: number;
  start_date: string;
  end_date: string;
  techtags: string;
}) {
  await checkAdminAccess();
  return createProject(project);
}

export async function updateProjectAction(id: number, updates: Partial<{
  image: string;
  title: string;
  description: string;
  scope: string;
  team_size: number;
  start_date: string;
  end_date: string;
  techtags: string;
}>) {
  await checkAdminAccess();
  return updateProject(id, updates);
}

export async function deleteProjectAction(id: number) {
  await checkAdminAccess();
  return deleteProject(id);
}

// Tech Stack Actions
export async function getTechStacksAction() {
  await checkAdminAccess();
  return getTechStacks();
}

export async function createTechStackAction(techstack: {
  name: string;
  note: string;
}) {
  await checkAdminAccess();
  return createTechStack(techstack);
}

export async function updateTechStackAction(id: number, updates: Partial<{
  name: string;
  note: string;
}>) {
  await checkAdminAccess();
  return updateTechStack(id, updates);
}

export async function deleteTechStackAction(id: number) {
  await checkAdminAccess();
  return deleteTechStack(id);
}

export async function getTechStackSuggestionsAction(search: string) {
  'use server';
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('techstacks')
    .select('name')
    .ilike('name', `%${search}%`)
    .order('name')
    .limit(10);

  if (error) throw error;
  return data.map(ts => ts.name);
} 