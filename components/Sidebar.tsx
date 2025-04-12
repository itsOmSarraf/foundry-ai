"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  LineChart, 
  Rocket, 
  BookOpen, 
  MessageSquare,
  ChevronsLeft,
  ChevronsRight,
  Building2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const routes = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Tracker', path: '/tracker', icon: LineChart },
  { name: 'Quickstart', path: '/quickstart', icon: Rocket },
  { name: 'Resources', path: '/resources', icon: BookOpen },
  { name: 'Company Research', path: '/exa', icon: Building2 },
  { name: 'Chat', path: '/chat', icon: MessageSquare }
];

const SINGLE_CHAT_ID = "persistent-chat";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if on mobile when component mounts and on window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Fix the Chat route path to use persistent chat ID
  const getRoutePath = (path: string) => {
    return path === '/chat' ? '/chat/persistent-chat' : path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-background border"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-40 bg-background border-l transition-transform duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
          isMobile && !isOpen && "translate-x-full",
          isMobile && isOpen && "translate-x-0",
          !isMobile && !isOpen && "translate-x-0"
        )}
      >
        <TooltipProvider delayDuration={0}>
          <div className="p-4 h-full flex flex-col">
            <div className={cn("mb-8 flex items-center", isOpen ? "justify-between" : "justify-center")}>
              {isOpen && <h2 className="text-xl font-bold">Coding Ninjas</h2>}
              {isMobile ? (
                isOpen && (
                  <button onClick={() => setIsOpen(false)} className="md:hidden">
                    <X size={20} />
                  </button>
                )
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setIsOpen(!isOpen)} 
                      className="p-1 rounded-md hover:bg-accent"
                    >
                      {isOpen ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {isOpen ? 'Collapse' : 'Expand'}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <nav className="space-y-2 flex-1">
              {routes.map((route) => (
                <div key={route.path}>
                  {!isOpen ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link 
                          href={getRoutePath(route.path)}
                          onClick={() => isMobile && setIsOpen(false)}
                          className={cn(
                            "flex items-center rounded-md hover:bg-accent",
                            "p-2 justify-center",
                            (pathname === route.path || (route.path === '/chat' && pathname.startsWith('/chat'))) && 
                              "bg-accent text-accent-foreground font-medium"
                          )}
                        >
                          <route.icon className="h-4 w-4" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        {route.name}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link 
                      href={getRoutePath(route.path)}
                      onClick={() => isMobile && setIsOpen(false)}
                      className={cn(
                        "flex items-center rounded-md hover:bg-accent",
                        "px-3 py-2 text-sm",
                        (pathname === route.path || (route.path === '/chat' && pathname.startsWith('/chat'))) && 
                          "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      <route.icon className="h-4 w-4 mr-2" />
                      {route.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            
            {!isMobile && (
              <div className="pt-4 border-t">
                {!isOpen ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="flex items-center w-full rounded-md hover:bg-accent p-2 justify-center"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      Expand sidebar
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex items-center w-full rounded-md hover:bg-accent px-3 py-2 text-sm justify-between"
                  >
                    <span>Collapse</span>
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </TooltipProvider>
      </div>
      
      {/* Overlay to close sidebar on mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 