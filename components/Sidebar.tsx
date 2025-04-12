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
  ChevronsRight
} from 'lucide-react';

const routes = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Tracker', path: '/tracker', icon: LineChart },
  { name: 'Quickstart', path: '/quickstart', icon: Rocket },
  { name: 'Resources', path: '/resources', icon: BookOpen },
  { name: 'Chat', path: '/chat', icon: MessageSquare }
];

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

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background border-r transition-transform duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0",
          !isMobile && !isOpen && "translate-x-0"
        )}
      >
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
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-1 rounded-md hover:bg-accent"
              >
                {isOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
              </button>
            )}
          </div>
          <nav className="space-y-2 flex-1">
            {routes.map((route) => (
              <Link 
                key={route.path} 
                href={route.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={cn(
                  "flex items-center rounded-md hover:bg-accent",
                  isOpen ? "px-3 py-2 text-sm" : "p-2 justify-center",
                  pathname === route.path && "bg-accent text-accent-foreground font-medium"
                )}
                title={!isOpen ? route.name : undefined}
              >
                <route.icon className={cn("h-4 w-4", isOpen && "mr-2")} />
                {isOpen && route.name}
              </Link>
            ))}
          </nav>
          
          {!isMobile && (
            <div className="pt-4 border-t">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={cn(
                  "flex items-center w-full rounded-md hover:bg-accent",
                  isOpen ? "px-3 py-2 text-sm" : "p-2 justify-center"
                )}
              >
                {isOpen ? (
                  <>
                    <ChevronsLeft className="h-4 w-4 mr-2" />
                    Collapse
                  </>
                ) : (
                  <ChevronsRight className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>
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