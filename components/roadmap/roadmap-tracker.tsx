"use client";

import React, { useState, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Pencil, Check, X, RefreshCw } from 'lucide-react';

import { useRoadmapStore, Milestone } from './use-roadmap-store';

export default function RoadmapTracker() {
  const { 
    milestones, 
    progress, 
    isLoaded,
    toggleComplete, 
    startEditing, 
    saveEdits, 
    cancelEditing, 
    addMilestone,
    resetToDefault 
  } = useRoadmapStore();
  
  const [listRef] = useAutoAnimate();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading your roadmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Progress</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{progress}% Complete</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetToDefault} 
              title="Reset to default milestones"
              className="h-8 w-8"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Separator />
      
      {/* Milestones list */}
      <div className="space-y-4" ref={listRef}>
        {milestones.map((milestone) => (
          <MilestoneCard 
            key={milestone.id}
            milestone={milestone}
            onToggleComplete={toggleComplete}
            onStartEditing={startEditing}
            onSaveEdits={saveEdits}
            onCancelEditing={cancelEditing}
          />
        ))}
      </div>
      
      {/* Add milestone button */}
      <Button 
        onClick={addMilestone} 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 py-6 border-dashed"
      >
        <PlusCircle size={16} />
        <span>Add Custom Milestone</span>
      </Button>
    </div>
  );
}

// Milestone Card component
interface MilestoneProps {
  milestone: Milestone;
  onToggleComplete: (id: string) => void;
  onStartEditing: (id: string) => void;
  onSaveEdits: (id: string, title: string, description: string) => void;
  onCancelEditing: (id: string) => void;
}

function MilestoneCard({ 
  milestone, 
  onToggleComplete, 
  onStartEditing, 
  onSaveEdits, 
  onCancelEditing 
}: MilestoneProps) {
  const [title, setTitle] = useState(milestone.title);
  const [description, setDescription] = useState(milestone.description);

  // Reset form when editing mode changes
  useEffect(() => {
    if (milestone.editing) {
      setTitle(milestone.title);
      setDescription(milestone.description);
    }
  }, [milestone.editing, milestone.title, milestone.description]);

  return (
    <Card className={`transition-all ${milestone.completed ? 'bg-muted/50' : ''}`}>
      {!milestone.editing ? (
        // View mode
        <>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id={`milestone-${milestone.id}`}
                  checked={milestone.completed}
                  onCheckedChange={() => onToggleComplete(milestone.id)}
                  className="mt-1"
                />
                <div>
                  <CardTitle className={`${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {milestone.title}
                  </CardTitle>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onStartEditing(milestone.id)}
                aria-label="Edit milestone"
              >
                <Pencil size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className={`mt-2 ${milestone.completed ? 'text-muted-foreground' : ''}`}>
              {milestone.description}
            </CardDescription>
          </CardContent>
        </>
      ) : (
        // Edit mode
        <>
          <CardHeader className="pb-2">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Milestone title"
              className="font-medium text-base"
            />
          </CardHeader>
          <CardContent>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Milestone description"
              className="resize-none h-24"
            />
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onCancelEditing(milestone.id)}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onSaveEdits(milestone.id, title, description)}
            >
              <Check size={16} className="mr-2" />
              Save
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
} 