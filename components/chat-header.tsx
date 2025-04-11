'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AlertCircle, Rocket } from 'lucide-react';
import { Badge } from './ui/badge';

function PureChatHeader({
  chatId,
  hasOnboardingData = false,
}: {
  chatId: string;
  hasOnboardingData?: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-4 md:px-4 gap-2 border-b">
      <SidebarToggle />

      <div className="flex-1 flex items-center gap-2">
        <h1 className="text-lg font-semibold hidden md:block">Foundry.AI</h1>
        
        {!hasOnboardingData && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="border-amber-500 text-amber-500 flex items-center gap-1 cursor-pointer hover:bg-amber-50"
                onClick={() => router.push('/onboarding')}
              >
                <AlertCircle className="h-3 w-3" />
                <span className="hidden md:inline">Complete Profile</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Complete your profile to get personalized responses</TooltipContent>
          </Tooltip>
        )}

        {hasOnboardingData && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="border-green-500 text-green-500 flex items-center gap-1 hover:bg-green-50"
              >
                <Rocket className="h-3 w-3" />
                <span className="hidden md:inline">Profile Active</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Your founder profile data is included with every message</TooltipContent>
          </Tooltip>
        )}
      </div>

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit"
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full p-1 h-fit w-fit"
            asChild
          >
            <Link href="/profile">
              <Avatar>
                <AvatarFallback className={`${hasOnboardingData ? 'bg-primary' : 'bg-primary/10'}`}>
                  <Rocket className={`h-5 w-5 ${hasOnboardingData ? 'text-primary-foreground' : 'text-primary'}`} />
                </AvatarFallback>
              </Avatar>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Your Profile</TooltipContent>
      </Tooltip>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  if (prevProps.hasOnboardingData !== nextProps.hasOnboardingData) return false;
  return true;
});
