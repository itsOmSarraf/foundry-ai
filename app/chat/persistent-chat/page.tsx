'use client';

import { Suspense } from 'react';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { Loader2 } from 'lucide-react';
import { UIMessage } from 'ai';

// The single persistent chat ID
const SINGLE_CHAT_ID = 'persistent-chat';

export default function PersistentChatPage() {
  // Empty initial messages array for client-side rendering
  const initialMessages: UIMessage[] = [];

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <Chat
        key={SINGLE_CHAT_ID}
        id={SINGLE_CHAT_ID}
        initialMessages={initialMessages}
        selectedChatModel={DEFAULT_CHAT_MODEL}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={SINGLE_CHAT_ID} />
    </Suspense>
  );
}
