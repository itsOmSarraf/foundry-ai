"use client";

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/lib/store/onboarding';

export type DocumentStatus = "Not Generated" | "Generating" | "Generated" | "Needs Review";
export type DocumentAction = "generate" | "view" | "edit" | "download" | "copy";

export interface Document {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  content: string;
  icon: string;
  actions: DocumentAction[];
  category: "Financial" | "Legal" | "Marketing" | "Fundraising";
  lastUpdated?: string;
}

// Default documents
const defaultDocuments: Document[] = [
  {
    id: "business-model",
    title: "Business Model Canvas",
    description: "Visualize your business model with key components like value proposition, customer segments, and revenue streams.",
    status: "Not Generated",
    content: "",
    icon: "💼",
    actions: ["generate"],
    category: "Financial",
  },
  {
    id: "profit-projection",
    title: "Profit Projection",
    description: "Estimate your revenue, costs, and break-even timeline for the next 6-12 months.",
    status: "Not Generated",
    content: "",
    icon: "💰",
    actions: ["generate"],
    category: "Financial",
  },
  {
    id: "executive-summary",
    title: "Executive Summary",
    description: "One-page overview of your startup covering mission, market, and growth potential.",
    status: "Not Generated",
    content: "",
    icon: "📝",
    actions: ["generate"],
    category: "Marketing",
  },
  {
    id: "vc-email-drafts",
    title: "VC Email Drafts",
    description: "Pre-filled email templates for cold outreach, follow-ups, and thank-you notes to investors.",
    status: "Not Generated",
    content: "",
    icon: "📧",
    actions: ["generate"],
    category: "Fundraising",
  },
  {
    id: "market-analysis",
    title: "Market Analysis",
    description: "Detailed analysis of your market with competitor insights and potential growth opportunities.",
    status: "Not Generated",
    content: "",
    icon: "📊",
    actions: ["generate"],
    category: "Marketing",
  },
  {
    id: "govt-scheme-checklist",
    title: "Government Scheme Checklist",
    description: "List of relevant legal requirements and government opportunities for your startup.",
    status: "Not Generated",
    content: "",
    icon: "📋",
    actions: ["generate"],
    category: "Legal",
  },
];

// Function to format onboarding data into a structured startup details string
function formatStartupDetails(data: Record<string, any>): string {
  if (!data || Object.keys(data).length === 0) {
    return "No profile data available. Please complete your profile for customized documents.";
  }

  const details = [];

  // Founder information
  if (data.founder_name) {
    details.push(`Founder Name: ${data.founder_name}`);
  }
  if (data.founder_role) {
    details.push(`Founder Role: ${data.founder_role}`);
  }
  if (data.founder_experience) {
    details.push(`Experience: ${data.founder_experience}`);
  }

  // Startup information
  if (data.startup_name) {
    details.push(`Company Name: ${data.startup_name}`);
  }
  if (data.startup_description) {
    details.push(`Description: ${data.startup_description}`);
  }
  if (data.startup_stage) {
    details.push(`Stage: ${data.startup_stage}`);
  }
  if (data.startup_industry) {
    details.push(`Industry: ${data.startup_industry}`);
  }
  if (data.target_customers && Array.isArray(data.target_customers)) {
    details.push(`Target Customers: ${data.target_customers.join(', ')}`);
  }
  if (data.competitive_advantage) {
    details.push(`Competitive Advantage: ${data.competitive_advantage}`);
  }
  if (data.funding_status) {
    details.push(`Funding Status: ${data.funding_status}`);
  }
  if (data.revenue_status) {
    details.push(`Revenue Status: ${data.revenue_status ? 'Revenue generating' : 'Pre-revenue'}`);
  }
  if (data.team_size) {
    details.push(`Team Size: ${data.team_size}`);
  }
  if (data.location) {
    details.push(`Location: ${data.location}`);
  }

  // Add any other relevant fields
  if (data.biggest_challenge) {
    details.push(`Biggest Challenge: ${data.biggest_challenge}`);
  }
  if (data.goals && Array.isArray(data.goals)) {
    details.push(`Goals: ${data.goals.join(', ')}`);
  }

  return details.join('\n');
}

export function useDocumentStore() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  
  // Get onboarding data from the store
  const onboardingData = useOnboardingStore(state => state.data);

  // Load documents from localStorage on component mount
  useEffect(() => {
    const loadDocuments = () => {
      try {
        const savedDocuments = localStorage.getItem('ai-generated-documents');
        if (savedDocuments) {
          setDocuments(JSON.parse(savedDocuments));
        } else {
          setDocuments(defaultDocuments);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
        setDocuments(defaultDocuments);
      }
      setIsLoaded(true);
    };

    // Only run in the browser
    if (typeof window !== 'undefined') {
      loadDocuments();
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('ai-generated-documents', JSON.stringify(documents));
    }
  }, [documents, isLoaded]);

  // Get document by ID
  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id) || null;
  };

  // Generate a document using Gemini API
  const generateDocument = async (id: string) => {
    // Update status to generating
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id 
          ? { ...doc, status: "Generating" as DocumentStatus }
          : doc
      )
    );

    try {
      // Format startup details from onboarding data
      const startupDetails = formatStartupDetails(onboardingData);

      // Call the API to generate document content
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: id,
          startupDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      const data = await response.json();
      
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === id 
            ? { 
                ...doc, 
                status: "Generated", 
                content: data.content,
                actions: ["view", "edit", "download", "copy"],
                lastUpdated: new Date().toISOString()
              }
            : doc
        )
      );
    } catch (error) {
      console.error('Error generating document:', error);
      
      // Set status back to Not Generated on error
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === id 
            ? { ...doc, status: "Not Generated" }
            : doc
        )
      );
    }
  };

  // Update document content
  const updateDocumentContent = (id: string, newContent: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id 
          ? { 
              ...doc, 
              content: newContent,
              status: "Needs Review",
              lastUpdated: new Date().toISOString()
            }
          : doc
      )
    );
  };

  // Reset to default documents
  const resetToDefault = () => {
    setDocuments(defaultDocuments);
  };

  // Calculate overall progress
  const calculateProgress = () => {
    const totalDocs = documents.length;
    const generatedDocs = documents.filter(doc => doc.status === "Generated" || doc.status === "Needs Review").length;
    return totalDocs > 0 ? Math.round((generatedDocs / totalDocs) * 100) : 0;
  };

  // Get documents grouped by category
  const getDocumentsByCategory = () => {
    const grouped: Record<string, Document[]> = {};
    
    documents.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });
    
    return grouped;
  };

  return {
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
  };
} 