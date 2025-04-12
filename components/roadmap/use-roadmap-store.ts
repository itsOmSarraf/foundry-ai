"use client";

import { useState, useEffect } from 'react';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  editing: boolean;
}

// Default milestones
const defaultMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Validate Idea',
    description: 'Use the chatbot to assess market demand, get feedback, and refine your startup pitch.',
    completed: false,
    editing: false,
  },
  {
    id: '2',
    title: 'Research Competitors',
    description: 'Discover existing players using Exa search and AI recommendations.',
    completed: false,
    editing: false,
  },
  {
    id: '3',
    title: 'Find Co-Founder',
    description: 'Connect with potential tech or business co-founders in your local ecosystem.',
    completed: false,
    editing: false,
  },
  {
    id: '4',
    title: 'Design Business Model',
    description: 'Use the AI-generated template to draft your lean canvas or business model.',
    completed: false,
    editing: false,
  },
  {
    id: '5',
    title: 'Build MVP',
    description: 'Prototype the core features of your product using no-code/low-code tools or dev help.',
    completed: false,
    editing: false,
  },
  {
    id: '6',
    title: 'Legal/Government Registrations',
    description: 'Complete necessary legal paperwork and registrations for your business entity.',
    completed: false,
    editing: false,
  },
  {
    id: '7',
    title: 'Find Investors',
    description: 'Connect with potential investors or apply for accelerator programs.',
    completed: false,
    editing: false,
  },
  {
    id: '8',
    title: 'Go-To-Market Launch',
    description: 'Execute your marketing strategy and officially launch your product.',
    completed: false,
    editing: false,
  },
  {
    id: '9',
    title: 'Post-Launch Feedback Loop',
    description: 'Collect and analyze customer feedback to improve your product.',
    completed: false,
    editing: false,
  },
];

export function useRoadmapStore() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load milestones from localStorage on component mount
  useEffect(() => {
    const loadMilestones = () => {
      try {
        const savedMilestones = localStorage.getItem('startup-roadmap-milestones');
        if (savedMilestones) {
          setMilestones(JSON.parse(savedMilestones));
        } else {
          setMilestones(defaultMilestones);
        }
      } catch (error) {
        console.error('Error loading milestones:', error);
        setMilestones(defaultMilestones);
      }
      setIsLoaded(true);
    };

    // Only run in the browser
    if (typeof window !== 'undefined') {
      loadMilestones();
    }
  }, []);

  // Save milestones to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('startup-roadmap-milestones', JSON.stringify(milestones));
    }
  }, [milestones, isLoaded]);

  // Calculate progress whenever milestones change
  useEffect(() => {
    if (milestones.length > 0) {
      const completedCount = milestones.filter(milestone => milestone.completed).length;
      const totalCount = milestones.length;
      const newProgress = Math.round((completedCount / totalCount) * 100);
      setProgress(newProgress);
    }
  }, [milestones]);

  // Toggle completion status
  const toggleComplete = (id: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, completed: !milestone.completed }
        : milestone
    ));
  };

  // Start editing a milestone
  const startEditing = (id: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, editing: true }
        : { ...milestone, editing: false }
    ));
  };

  // Save edits to a milestone
  const saveEdits = (id: string, newTitle: string, newDescription: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, title: newTitle, description: newDescription, editing: false }
        : milestone
    ));
  };

  // Cancel editing
  const cancelEditing = (id: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, editing: false }
        : milestone
    ));
  };

  // Add a new milestone
  const addMilestone = () => {
    const newId = (milestones.length + 1).toString();
    setMilestones([
      ...milestones,
      {
        id: newId,
        title: 'New Milestone',
        description: 'Click the edit button to customize this milestone',
        completed: false,
        editing: true,
      }
    ]);
  };

  // Reset to default milestones
  const resetToDefault = () => {
    setMilestones(defaultMilestones);
  };

  return {
    milestones,
    progress,
    isLoaded,
    toggleComplete,
    startEditing,
    saveEdits,
    cancelEditing,
    addMilestone,
    resetToDefault,
  };
} 