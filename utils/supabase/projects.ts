import { createClient } from '@/utils/supabase/server';

// Project operations
export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectById(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Helper function to get tech stack suggestions
export async function getTechStackSuggestions(search: string) {
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

export async function createProject(project: {
  image: string;
  title: string;
  description: string;
  scope: string;
  team_size: number;
  start_date: string;
  end_date: string;
  techtags: string;
}) {
  const supabase = await createClient();
  
  // Format dates to ISO string and handle empty end_date
  const formattedProject = {
    ...project,
    start_date: project.start_date ? new Date(project.start_date).toISOString() : undefined,
    end_date: project.end_date ? new Date(project.end_date).toISOString() : undefined,
    techtags: project.techtags.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .join(', ')
  };
  
  const { data, error } = await supabase
    .from('projects')
    .insert([formattedProject])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: number, updates: Partial<{
  image: string;
  title: string;
  description: string;
  scope: string;
  team_size: number;
  start_date: string;
  end_date: string;
  techtags: string;
}>) {
  const supabase = await createClient();
  
  // First verify the project exists
  const { data: existing, error: checkError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError) {
    console.error('Error checking project:', checkError);
    throw new Error(`Project with ID ${id} not found`);
  }

  if (!existing) {
    throw new Error(`Project with ID ${id} not found`);
  }

  // Prepare update data with formatted dates
  const updateData = { ...updates };
  if (updates.start_date !== undefined) {
    updateData.start_date = updates.start_date ? new Date(updates.start_date).toISOString() : undefined;
  }
  if (updates.end_date !== undefined) {
    updateData.end_date = updates.end_date ? new Date(updates.end_date).toISOString() : undefined;
  }
  if (updates.techtags !== undefined) {
    updateData.techtags = updates.techtags.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .join(', ');
  }

  // Update project
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update project: No data returned');
  }

  return data;
}

export async function deleteProject(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 