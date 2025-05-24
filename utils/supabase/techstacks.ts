import { createClient } from '@/utils/supabase/server';

// Tech Stack operations
export async function getTechStacks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('techstacks')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getTechStackById(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('techstacks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTechStack(techstack: {
  name: string;
  note: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('techstacks')
    .insert([techstack])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTechStack(id: number, updates: Partial<{
  name: string;
  note: string;
}>) {
  const supabase = await createClient();
  
  // First verify the tech stack exists
  const { data: existing, error: checkError } = await supabase
    .from('techstacks')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError) {
    console.error('Error checking tech stack:', checkError);
    throw new Error(`Tech stack with ID ${id} not found`);
  }

  if (!existing) {
    throw new Error(`Tech stack with ID ${id} not found`);
  }

  // Then perform the update
  const { data, error } = await supabase
    .from('techstacks')
    .update({
      name: updates.name?.trim(),
      note: updates.note?.trim() || "",
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tech stack:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update tech stack: No data returned');
  }

  return data;
}

export async function deleteTechStack(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('techstacks')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 