import React from 'react';
import DocumentGenerator from '@/components/docs-generator/document-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function QuickstartPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="container py-6 md:py-10 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">AI-Generated Docs</h1>
            <p className="text-muted-foreground">
              Generate essential startup documents using AI and store them for review or download.
            </p>
          </div>

          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList className="mx-auto flex justify-center">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="space-y-4">
              <DocumentGenerator />
            </TabsContent>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About AI-Generated Docs</CardTitle>
                  <CardDescription>
                    Save time by automatically generating essential startup documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    AI-Generated Docs helps founders quickly produce polished, structured documents 
                    without needing to start from scratch. Our AI-powered system can generate various 
                    documents essential for your startup journey.
                  </p>
                  
                  <h3 className="text-lg font-medium">Available Documents:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Business Model (Lean Canvas / Business Model Canvas)</li>
                    <li>Profit Projection (next 6–12 months, editable layout)</li>
                    <li>Executive Summary (1-page overview of your startup)</li>
                    <li>VC Email Drafts (cold emails, pitch follow-ups, thank-you notes)</li>
                    <li>Market Analysis (with competitor insights and charts)</li>
                    <li>Govt Scheme Checklist (relevant legal and government opportunities)</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium">How to use:</h3>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Browse the available document types</li>
                    <li>Click &quot;Generate&quot; to create a document using AI</li>
                    <li>View, edit, or download your generated documents</li>
                    <li>Use the document status tags to track your progress</li>
                  </ol>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Your documents are stored securely and can be accessed or edited at any time.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 