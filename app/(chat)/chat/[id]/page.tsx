'use client';

import { Suspense } from 'react';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { Loader2 } from 'lucide-react';
import { UIMessage } from 'ai';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// The single persistent chat ID that should be used
const SINGLE_CHAT_ID = "persistent-chat";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  
  // Extract the chat ID from params
  const id = String(params?.id || '');
  
  // Redirect to the persistent chat ID if the user tries to access any other chat
  useEffect(() => {
    if (id && id !== SINGLE_CHAT_ID) {
      router.replace(`/chat/${SINGLE_CHAT_ID}`);
    }
  }, [id, router]);
  
  // Empty initial messages array for client-side rendering
  const initialMessages: UIMessage[] = [];
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
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
