"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewChatPage() {
  const router = useRouter();
  const [loadingCounter, setLoadingCounter] = useState(0);

  useEffect(() => {
    // Use a counter to track loading time
    const timer = setInterval(() => {
      setLoadingCounter(prev => prev + 1);
    }, 1000);

    // Redirect to the hardcoded persistent chat with a short delay
    const redirectTimeout = setTimeout(() => {
      router.replace('/chat/persistent-chat');
    }, 300);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Loading chat... ({loadingCounter}s)</p>
      </div>
    </div>
  );
} 