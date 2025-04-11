'use client';

import { Suspense } from 'react';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { Loader2 } from 'lucide-react';
import { UIMessage } from 'ai';

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params: paramsPromise }: ChatPageProps) {
  const params = await paramsPromise;

  // Type assertion is safer than using React.use() in this context
  // Extract the chat ID from params
  const id = String(params.id);
  
  // Empty initial messages array for client-side rendering
  const initialMessages: UIMessage[] = [];
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <Chat
        key={id}
        id={id}
        initialMessages={initialMessages}
        selectedChatModel={DEFAULT_CHAT_MODEL}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </Suspense>
  );
}
