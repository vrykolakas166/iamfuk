'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/page-layout";
import { FileText, Download, Trash, Loader2 } from 'lucide-react';

// Sample data - in real app, this would come from an API
const sampleFiles = [
  {
    id: 1,
    name: 'Project Proposal.pdf',
    type: 'pdf',
    size: '2.4 MB',
    updated: '2 hours ago',
    icon: 'mdi:file-pdf-box',
  },
  {
    id: 2,
    name: 'Meeting Notes.docx',
    type: 'doc',
    size: '1.2 MB',
    updated: '1 day ago',
    icon: 'mdi:file-word-box',
  },
  {
    id: 3,
    name: 'Budget 2024.xlsx',
    type: 'xls',
    size: '3.1 MB',
    updated: '3 days ago',
    icon: 'mdi:file-excel-box',
  },
  {
    id: 4,
    name: 'Team Photo.jpg',
    type: 'img',
    size: '4.5 MB',
    updated: '1 week ago',
    icon: 'mdi:file-image-box',
  },
];

export default function DocumentsPage() {
  const [files, setFiles] = useState<typeof sampleFiles>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchFiles = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setFiles(sampleFiles);
        setLoading(false);
      } catch (err) {
        setError('Failed to load documents');
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const uploadButton = (
    <Button className="gap-2">
      <FileText className="w-5 h-5" />
      Upload
    </Button>
  );

  return (
    <PageLayout
      title="Documents"
      icon="mdi:folder"
      loading={loading}
      error={error}
      headerAction={uploadButton}
    >
      {files.length === 0 ? (
        <div className="text-center text-foreground/60 py-8">
          No documents available
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div 
              key={file.id} 
              className="flex items-center gap-4 p-4 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-foreground/5">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-sm text-foreground/60">
                  {file.size} • Updated {file.updated}
                </div>
              </div>
              <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all">
                <FileText className="w-5 h-5 text-foreground/60" />
              </button>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
} 