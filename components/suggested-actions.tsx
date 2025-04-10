'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: '💡 Validate my idea',
      label: 'for a subscription-based grocery delivery app',
      action: 'Can you help me validate my idea for a subscription-based grocery delivery app? What are the key things I should consider?',
    },
    {
      title: '🧠 Find similar startups',
      label: 'in the mental health tech space',
      action: 'Show me similar startups in the mental health tech space and analyze their business models',
    },
    {
      title: '📊 Generate',
      label: 'profit projections for my SaaS startup',
      action: 'Help me create a basic profit projection for my SaaS startup in the first 2 years',
    },
    {
      title: '🤝 Help me find',
      label: 'a technical co-founder',
      action: 'What should I look for in a technical co-founder? How can I attract the right person?',
    },
    {
      title: '💰 List investors',
      label: 'for HealthTech startups in India',
      action: 'Can you provide a list of investors and VCs focusing on HealthTech startups in India?',
    },
    {
      title: '📑 Explain legal requirements',
      label: 'for launching a fintech startup',
      action: 'What are the main legal requirements and regulations for launching a fintech startup?',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 3 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start hover:bg-muted/50"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
