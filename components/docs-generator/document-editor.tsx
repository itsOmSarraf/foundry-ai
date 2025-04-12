"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Document } from './use-document-store';
import { Copy, Download, X, Save, RefreshCw } from 'lucide-react';

interface DocumentEditorProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, content: string) => void;
}

export default function DocumentEditor({ document, isOpen, onClose, onSave }: DocumentEditorProps) {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (document) {
      setContent(document.content);
    }
  }, [document]);

  const handleSave = async () => {
    if (!document) return;
    
    setIsSaving(true);
    try {
      await onSave(document.id, content);
      setMode('preview');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!document) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    if (!document) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = window.document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${document.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    window.document.body.appendChild(downloadLink);
    downloadLink.click();
    window.document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // Function to convert markdown to simple HTML (very basic)
  const renderMarkdown = (text: string) => {
    // This is a very simplified version - in a real app, use a proper markdown renderer
    return text
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gm, '<em>$1</em>')
      .replace(/\n/gm, '<br />');
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{document.icon}</span>
                <DialogTitle>{document.title}</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              {document.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs 
          value={mode} 
          onValueChange={(value) => setMode(value as 'preview' | 'edit')}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
                className="gap-1"
              >
                <Copy className="h-3.5 w-3.5" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-6 py-4">
            <TabsContent 
              value="preview" 
              className="h-full flex-1 rounded-md border p-4 bg-background data-[state=active]:flex data-[state=active]:flex-col overflow-auto"
            >
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </TabsContent>
            
            <TabsContent 
              value="edit" 
              className="h-full flex flex-col data-[state=active]:flex"
            >
              <div className="flex-1 h-full flex flex-col">
                <Textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 h-full min-h-[calc(100%-50px)] font-mono text-sm resize-none"
                  placeholder="Enter your document content here..."
                />
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setContent(document.content);
                      setMode('preview');
                    }}
                    className="gap-1"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </Button>
                  
                  <Button 
                    onClick={handleSave}
                    className="gap-1"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 