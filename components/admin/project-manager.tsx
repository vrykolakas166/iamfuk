'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { getProjectsAction, createProjectAction, updateProjectAction, deleteProjectAction, getTechStackSuggestionsAction } from '@/app/actions/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner"
import { Combobox } from '@/components/ui/combobox';

type Project = {
  id: number;
  image: string;
  title: string;
  description: string;
  scope: string;
  team_size: number;
  start_date: string;
  end_date: string;
  techtags: string;
  created_at: Date;
};

type ProjectFormData = {
  image: string;
  title: string;
  description: string;
  scope: string;
  team_size: number;
  start_date: string;
  end_date: string;
  techtags: string;
};

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    image: '',
    title: '',
    description: '',
    scope: '',
    team_size: 1,
    start_date: '',
    end_date: '',
    techtags: '',
  });
  const [techStackSuggestions, setTechStackSuggestions] = useState<{ value: string; label: string; }[]>([]);
  const [selectedTechTags, setSelectedTechTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjectsAction();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTechStackSuggestions = async () => {
    try {
      const suggestions = await getTechStackSuggestionsAction('');
      setTechStackSuggestions(suggestions.map(name => ({ value: name, label: name })));
    } catch (err) {
      console.error('Failed to load tech stack suggestions:', err);
    }
  };

  const handleOpenModal = async (project?: Project) => {
    await loadTechStackSuggestions();
    setSearchQuery('');
    
    if (project) {
      setEditingProject(project);
      setFormData({
        image: project.image || '',
        title: project.title || '',
        description: project.description || '',
        scope: project.scope || '',
        team_size: project.team_size || 1,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        techtags: project.techtags || '',
      });
      setSelectedTechTags(project.techtags.split(',').map(tag => tag.trim()).filter(Boolean));
    } else {
      setEditingProject(null);
      setFormData({
        image: '',
        title: '',
        description: '',
        scope: '',
        team_size: 1,
        start_date: '',
        end_date: '',
        techtags: '',
      });
      setSelectedTechTags([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      image: '',
      title: '',
      description: '',
      scope: '',
      team_size: 1,
      start_date: '',
      end_date: '',
      techtags: '',
    });
    setSelectedTechTags([]);
    setTechStackSuggestions([]);
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProjectAction(editingProject.id, formData);
        toast.success("Project updated successfully");
      } else {
        await createProjectAction(formData);
        toast.success("Project created successfully");
      }
      await loadProjects();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save project. Please try again.");
    }
  };

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProjectAction(projectToDelete);
      await loadProjects();
      toast.success("Project deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleTechTagsChange = (tags: string[]) => {
    setSelectedTechTags(tags);
    setFormData(prev => ({
      ...prev,
      techtags: tags.join(', ')
    }));
  };

  const handleSearch = (search: string) => {
    setSearchQuery(search);
  };

  const filteredSuggestions = techStackSuggestions.filter(item => 
    !selectedTechTags.includes(item.value) && 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="pt-6">
              <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techtags.split(',').map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    Added {new Date(project.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(project.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>
              {editingProject 
                ? 'Update the project details below. All fields are required.'
                : 'Fill in the project details below. All fields are required.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value || '' })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value || '' })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value || '' })}
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Textarea
                id="scope"
                value={formData.scope || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, scope: e.target.value || '' })}
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team_size">Team Size</Label>
                <Input
                  id="team_size"
                  type="number"
                  value={formData.team_size || 1}
                  onChange={(e) => setFormData({ ...formData, team_size: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="2000000000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="techtags">Tech Tags</Label>
                <div className="relative">
                  <Combobox
                    items={filteredSuggestions}
                    value={selectedTechTags}
                    onChange={handleTechTagsChange}
                    onSearch={handleSearch}
                    placeholder="Search or add tech tags..."
                    emptyText="No matching tech stacks found. Type to add a new tag."
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value || '' })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value || '' })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProject ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the project and remove it from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 