import React from 'react';
import RoadmapTracker from '@/components/roadmap/roadmap-tracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TrackerPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="container py-6 md:py-10 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Startup Roadmap Tracker</h1>
            <p className="text-muted-foreground">
              Track your progress from idea to launch with this customizable roadmap.
            </p>
          </div>

          <Tabs defaultValue="roadmap" className="space-y-4">
            <TabsList className="mx-auto flex justify-center">
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roadmap" className="space-y-4">
              <RoadmapTracker />
            </TabsContent>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About the Startup Roadmap Tracker</CardTitle>
                  <CardDescription>
                    A guide to help you navigate your startup journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The Startup Roadmap Tracker helps founders track their progress through the key milestones of building a startup. 
                    Each milestone represents an important step in the journey from idea to launch.
                  </p>
                  
                  <h3 className="text-lg font-medium">Features:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Track your overall progress with a visual progress bar</li>
                    <li>Customize milestone titles and descriptions</li>
                    <li>Add your own custom milestones</li>
                    <li>Your progress is automatically saved in your browser</li>
                    <li>Reset to default milestones if needed</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium">How to use:</h3>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Check off milestones as you complete them</li>
                    <li>Click the edit button on any milestone to customize it</li>
                    <li>Add new milestones specific to your startup journey</li>
                    <li>Use the reset button if you want to start fresh</li>
                  </ol>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Your progress is automatically saved in your browser's local storage. If you clear your browser data, your progress will be reset.
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