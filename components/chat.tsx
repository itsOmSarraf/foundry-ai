'use client';

import type { Attachment, UIMessage } from 'ai';
import { useChat, type Message, type CreateMessage } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import type { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { toast } from 'sonner';
import { unstable_serialize } from 'swr/infinite';
import { getChatHistoryPaginationKey } from './sidebar-history';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { AlertCircle, Code } from 'lucide-react';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Extended error type for API errors
interface APIError extends Error {
  response?: {
    body?: ReadableStream<Uint8Array>;
    status?: number;
  };
}

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [storeHydrated, setStoreHydrated] = useState(false);
  // Get the entire store to ensure we have access to raw data
  const onboardingStore = useOnboardingStore();
  const onboardingData = useOnboardingStore(state => state.data);
  const forceRefresh = useOnboardingStore(state => state.forceRefresh);
  
  useEffect(() => {
    // Force a check of the store data after a small delay to ensure hydration
    const timer = setTimeout(() => {
      setStoreHydrated(true);
      // Force store refresh to ensure we have the latest data
      forceRefresh();
      // Log store data for debugging
      const currentData = onboardingStore.data;
      console.log("Store hydration check:", currentData);
      
      // If we have data stored in local storage but it's not in our state, force reload
      if (!currentData || Object.keys(currentData).length === 0) {
        try {
          // Check local storage directly
          const localStorageData = localStorage.getItem('onboarding-storage');
          if (localStorageData) {
            const parsedData = JSON.parse(localStorageData);
            if (parsedData?.state?.data && Object.keys(parsedData.state.data).length > 0) {
              console.log("Found data in localStorage but not in state, forcing refresh");
              forceRefresh();
            }
          }
        } catch (e) {
          console.error("Error checking localStorage:", e);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [onboardingStore, forceRefresh]);

  const hasOnboardingData = storeHydrated && onboardingData && Object.keys(onboardingData).length > 0;

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    error,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      console.error('Chat API error:', error);
      
      // Try to parse the response if it's a valid JSON
      const apiError = error as APIError;
      if (apiError.response && apiError.response.body) {
        try {
          const reader = apiError.response.body.getReader();
          reader.read().then(({ value }) => {
            const text = new TextDecoder().decode(value);
            try {
              const data = JSON.parse(text);
              console.error('API error details:', data);
              toast.error(`Error: ${data.message || 'Unknown error occurred'}`);
            } catch (e) {
              console.error('Non-JSON response:', text);
              toast.error(`Error: ${text.substring(0, 100)}`);
            }
          });
        } catch (readError) {
          console.error('Error reading response:', readError);
          toast.error('An error occurred while processing the response');
        }
      } else {
        toast.error('An error occurred, please try again!');
      }
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          hasOnboardingData={hasOnboardingData}
        />
        
        {error && (
          <div className="mx-auto w-full md:max-w-3xl p-4 my-2 bg-red-100 text-red-800 rounded-md">
            <p className="font-medium">Error occurred</p>
            <p className="text-sm">{error.message || 'Failed to communicate with the AI'}</p>
            <button 
              onClick={() => reload()} 
              className="mt-2 px-3 py-1 bg-red-200 rounded-md text-sm hover:bg-red-300"
            >
              Try Again
            </button>
          </div>
        )}

        {hasOnboardingData && (
          <div className="mx-auto w-full md:max-w-3xl p-2 my-1 bg-blue-50 text-blue-800 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p className="text-xs">Your founder profile data is automatically included with each message</p>
            {isDevelopment && (
              <span className="ml-auto bg-slate-200 px-1.5 py-0.5 rounded text-xs text-slate-700 flex items-center gap-1">
                <Code className="h-3 w-3" /> Debug Mode
              </span>
            )}
          </div>
        )}

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              append={append}
              onboardingData={onboardingData}
              hasOnboardingData={hasOnboardingData}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        append={append}
        onboardingData={onboardingData}
        hasOnboardingData={hasOnboardingData}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
