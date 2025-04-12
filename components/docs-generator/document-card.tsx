"use client";

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, 
  Download, 
  Copy, 
  Edit, 
  Eye, 
  Loader2,
  Check,
} from 'lucide-react';
import { Document, DocumentStatus } from './use-document-store';

interface DocumentCardProps {
  document: Document;
  onGenerate: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

// Status badge colors
const statusColors: Record<DocumentStatus, string> = {
  "Not Generated": "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  "Generating": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse",
  "Generated": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Needs Review": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export default function DocumentCard({ document, onGenerate, onView, onEdit }: DocumentCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const isGenerating = document.status === "Generating";
  const lastUpdated = document.lastUpdated 
    ? new Date(document.lastUpdated).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  // Handle download
  const handleDownload = () => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = window.document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${document.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    window.document.body.appendChild(downloadLink);
    downloadLink.click();
    window.document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(document.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Action buttons
  const ActionButtons = {
    generate: () => (
      <Button 
        variant="default" 
        onClick={() => onGenerate(document.id)} 
        disabled={isGenerating}
        className="gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            <span>Generate</span>
          </>
        )}
      </Button>
    ),
    view: () => (
      <Button variant="outline" size="icon" onClick={() => onView(document.id)} title="View Document">
        <Eye className="h-4 w-4" />
      </Button>
    ),
    edit: () => (
      <Button variant="outline" size="icon" onClick={() => onEdit(document.id)} title="Edit Document">
        <Edit className="h-4 w-4" />
      </Button>
    ),
    download: () => (
      <Button variant="outline" size="icon" onClick={handleDownload} title="Download Document">
        <Download className="h-4 w-4" />
      </Button>
    ),
    copy: () => (
      <Button variant="outline" size="icon" onClick={handleCopy} title="Copy to Clipboard">
        {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    ),
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{document.icon}</div>
            <div>
              <CardTitle className="text-lg">{document.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {document.description}
              </CardDescription>
            </div>
          </div>
          <Badge className={statusColors[document.status]}>
            {document.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardFooter className="pt-4 pb-4 flex justify-between">
        <div className="flex gap-2">
          {document.actions.includes("generate") && 
            ActionButtons.generate()}
          
          {document.actions.includes("view") && 
            ActionButtons.view()}
          
          {document.actions.includes("edit") && 
            ActionButtons.edit()}
          
          <TooltipProvider>
            {document.actions.includes("download") && (
              <Tooltip>
                <TooltipTrigger asChild>
                  {ActionButtons.download()}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Document</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {document.actions.includes("copy") && (
              <Tooltip>
                <TooltipTrigger asChild>
                  {ActionButtons.copy()}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copySuccess ? 'Copied!' : 'Copy to Clipboard'}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
        
        {lastUpdated && (
          <div className="text-xs text-muted-foreground">
            Updated: {lastUpdated}
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 