'use client';

import type { Attachment, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
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

  // Display error banner if there's an error
  if (error) {
    console.error('Error state from useChat:', error);
  }

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
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
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
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
