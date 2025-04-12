"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Generate a new UUID for the chat
    const newChatId = crypto.randomUUID();
    // Redirect to the new chat page
    router.push(`/chat/${newChatId}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Creating a new chat...</p>
      </div>
    </div>
  );
} 