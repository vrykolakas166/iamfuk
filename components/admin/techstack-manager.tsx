'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  getTechStacksAction, 
  createTechStackAction, 
  updateTechStackAction, 
  deleteTechStackAction 
} from '@/app/actions/admin';

type TechStack = {
  id: number;
  name: string;
  note: string;
  created_at: Date;
};

type TechStackFormData = {
  name: string;
  note: string;
};

export function TechStackManager() {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [techStackToDelete, setTechStackToDelete] = useState<number | null>(null);
  const [editingTechStack, setEditingTechStack] = useState<TechStack | null>(null);
  const [formData, setFormData] = useState<TechStackFormData>({
    name: '',
    note: '',
  });

  useEffect(() => {
    loadTechStacks();
  }, []);

  const loadTechStacks = async () => {
    try {
      const data = await getTechStacksAction();
      setTechStacks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tech stacks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (techStack?: TechStack) => {
    if (techStack) {
      setEditingTechStack(techStack);
      setFormData({
        name: techStack.name || '',
        note: techStack.note || '',
      });
    } else {
      setEditingTechStack(null);
      setFormData({
        name: '',
        note: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTechStack(null);
    setFormData({
      name: '',
      note: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.name.trim()) {
        toast.error("Name is required");
        return;
      }

      if (editingTechStack) {
        if (!editingTechStack.id) {
          toast.error("Invalid tech stack ID");
          return;
        }
        await updateTechStackAction(editingTechStack.id, {
          name: formData.name.trim(),
          note: formData.note.trim(),
        });
        toast.success("Tech stack updated successfully");
      } else {
        await createTechStackAction({
          name: formData.name.trim(),
          note: formData.note.trim(),
        });
        toast.success("Tech stack created successfully");
      }
      await loadTechStacks();
      handleCloseModal();
    } catch (err: any) {
      console.error('Error saving tech stack:', err);
      toast.error(err.message || "Failed to save tech stack. Please try again.");
    }
  };

  const handleDeleteClick = (id: number) => {
    setTechStackToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!techStackToDelete) return;
    try {
      await deleteTechStackAction(techStackToDelete);
      await loadTechStacks();
      toast.success("Tech stack deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete tech stack. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
      setTechStackToDelete(null);
    }
  };

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
        <h2 className="text-2xl font-bold">Tech Stacks</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tech Stack
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techStacks.map((techStack) => (
          <Card key={techStack.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{techStack.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {techStack.note}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Added {new Date(techStack.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(techStack)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(techStack.id)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTechStack ? 'Edit Tech Stack' : 'Add Tech Stack'}</DialogTitle>
            <DialogDescription>
              {editingTechStack 
                ? 'Update the tech stack details below. All fields are required.'
                : 'Fill in the tech stack details below. All fields are required.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value || '' })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={formData.note || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, note: e.target.value || '' })}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTechStack ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tech Stack</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the tech stack and remove it from the database.
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