'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboardingStore } from '@/lib/store/onboarding';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, HelpCircle, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function TestStorePage() {
  const { data, setData, updateField, clearData, forceRefresh } = useOnboardingStore();
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    // Mark as loaded after hydration
    setStoreLoaded(true);

    // Check if we navigated from another page
    const hasNavigated = window.performance && 
      window.performance.navigation && 
      window.performance.navigation.type === 1;
    
    setNavigated(hasNavigated);
    
    // Force refresh to ensure we have the latest data
    forceRefresh();
  }, [forceRefresh]);

  const hasData = Object.keys(data || {}).length > 0;

  const handleAddTestData = () => {
    setData({
      founder_name: 'Test User',
      startup_name: 'Test Startup',
      idea_one_liner: 'A test idea for verification',
      founder_role: 'Solo Founder',
      startup_stage: 'Idea',
      startup_industry: ['SaaS', 'AI/ML'],
      test_timestamp: new Date().toISOString()
    });
  };

  const handleUpdateField = () => {
    updateField('test_timestamp', new Date().toISOString());
  };

  const handleClearData = () => {
    clearData();
  };

  const handleForceRefresh = () => {
    forceRefresh();
    toast.success("Store data refreshed");
  };

  const createDebugMessage = () => {
    // Create a JSON-like string representation of the onboarding data
    const rawDataText = JSON.stringify(data || {}, null, 2);
    
    // Only include onboarding data if it exists and isn't empty
    const hasData = data && Object.keys(data).length > 0;
    
    const debugMessage = hasData ? 
      `this is all the details about the user -> ${rawDataText}

This is a test message to verify profile data transmission.` 
      : "No profile data available to create debug message";
    
    alert(debugMessage);
  };

  if (!storeLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading store data...</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Zustand Store Test</CardTitle>
            {hasData ? (
              <Badge className="bg-green-500 flex items-center gap-1 py-1">
                <CheckCircle className="h-3 w-3" />
                Store has data
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-500 text-amber-500 flex items-center gap-1 py-1">
                <AlertCircle className="h-3 w-3" />
                No data
              </Badge>
            )}
          </div>
          <CardDescription>
            Test the onboarding store functionality across pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 rounded bg-amber-50 border border-amber-200 flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-amber-700 text-sm">
                <p className="font-medium">How to test:</p>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>Click "Add Test Data" to create sample onboarding data</li>
                  <li>Navigate to Profile or Onboarding pages to verify data appears</li>
                  <li>Return to this test page to ensure data is preserved across navigation</li>
                </ol>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Current Store Data:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-80">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={handleAddTestData}>Add Test Data</Button>
          <Button onClick={handleUpdateField} variant="outline">Update Timestamp</Button>
          <Button onClick={handleClearData} variant="destructive">Clear Data</Button>
          <Button onClick={handleForceRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Force Refresh Store
          </Button>
          <Button onClick={createDebugMessage} variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Preview Debug Message
          </Button>
          <div className="w-full mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/onboarding">Go to Onboarding</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/profile">Go to Profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/chat/test">Try Chat</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 