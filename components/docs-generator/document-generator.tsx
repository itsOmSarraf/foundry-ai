"use client";

import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { useDocumentStore } from './use-document-store';
import { useOnboardingStore } from '@/lib/store/onboarding';
import DocumentCard from './document-card';
import DocumentEditor from './document-editor';

export default function DocumentGenerator() {
  const { 
    documents, 
    isLoaded,
    activeDocumentId,
    setActiveDocumentId,
    getDocument,
    generateDocument,
    updateDocumentContent,
    resetToDefault,
    calculateProgress,
    getDocumentsByCategory,
  } = useDocumentStore();

  // Get onboarding data to check if user has a profile
  const onboardingData = useOnboardingStore(state => state.data);
  const hasProfile = onboardingData && Object.keys(onboardingData).length > 0;
  const hasStartupName = Boolean(onboardingData?.startup_name);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<ReturnType<typeof getDocument>>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const progress = calculateProgress();
  const documentsByCategory = getDocumentsByCategory();
  const categories = Object.keys(documentsByCategory);

  // Handle document generation
  const handleGenerate = async (id: string) => {
    await generateDocument(id);
  };

  // Open document for viewing
  const handleViewDocument = (id: string) => {
    const doc = getDocument(id);
    setActiveDocument(doc);
    setActiveDocumentId(id);
    setIsEditorOpen(true);
  };

  // Open document for editing
  const handleEditDocument = (id: string) => {
    const doc = getDocument(id);
    setActiveDocument(doc);
    setActiveDocumentId(id);
    setIsEditorOpen(true);
  };

  // Save document content
  const handleSaveDocument = async (id: string, newContent: string) => {
    await updateDocumentContent(id, newContent);
    setActiveDocument(getDocument(id));
  };

  // Close the editor
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setActiveDocument(null);
    setActiveDocumentId(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile completeness alert */}
      {!hasProfile && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Required</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col space-y-2">
              <p>Please complete your profile to generate documents tailored to your startup.</p>
              <Button asChild variant="outline" className="w-fit border-amber-300">
                <Link href="/profile">Complete Profile</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hasProfile && !hasStartupName && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Profile can be enhanced</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col space-y-2">
              <p>We noticed your profile is missing some key details. For better personalized documents, please complete more information.</p>
              <Button asChild variant="outline" className="w-fit border-blue-300">
                <Link href="/profile">Update Profile</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Document Progress</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{progress}% Complete</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetToDefault} 
              title="Reset all documents"
              className="h-8 w-8"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* All documents vs. Categories */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>
        
        {/* All documents tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onGenerate={handleGenerate}
                onView={handleViewDocument}
                onEdit={handleEditDocument}
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Categorized documents tab */}
        <TabsContent value="categories">
          <Tabs 
            defaultValue={categories[0]} 
            value={activeCategory || categories[0]}
            onValueChange={setActiveCategory}
            className="space-y-4"
          >
            <TabsList className="flex flex-wrap mb-4">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="min-w-[120px]"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentsByCategory[category].map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onGenerate={handleGenerate}
                      onView={handleViewDocument}
                      onEdit={handleEditDocument}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Document editor dialog */}
      <DocumentEditor
        document={activeDocument}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveDocument}
      />
    </div>
  );
} 