'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  useEffect(() => {
    // Read cookie on client side
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar:state='))
      ?.split('=')[1];
    
    setIsCollapsed(cookieValue !== 'true');
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <div className="fixed inset-0 -z-10 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_0px),linear-gradient(to_bottom,#80808012_1px,transparent_0px)] bg-[size:60px_60px] pointer-events-none"></div>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
} 