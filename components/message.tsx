'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import type { Vote } from '@/lib/db/schema';
import { DocumentToolCall, DocumentToolResult } from './document';
import { PencilEditIcon, SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import { MessageReasoning } from './message-reasoning';
import { UseChatHelpers } from '@ai-sdk/react';
import { ChevronDown, ChevronUp, Bug } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store/onboarding';

// Check if in development
const isDevelopment = process.env.NODE_ENV === 'development';

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [showProfileData, setShowProfileData] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {message.experimental_attachments && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'reasoning') {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === 'text') {
                if (mode === 'view') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === 'user' && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode('edit');
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn('flex flex-col gap-4', {
                          'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                            message.role === 'user',
                        })}
                      >
                        {message.role === 'user' && part.type === 'text' ? (
                          <>
                            {/* DEBUG: Display raw message data structure */}
                            <div className="text-xs border-b border-primary-foreground/30 pb-2 mb-2 text-primary-foreground">
                              <div className="font-bold mb-1 flex items-center gap-1">
                                <span>��</span> DEBUG INFO
                                {isDevelopment && (
                                  <button
                                    className="ml-auto bg-black/20 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1"
                                    onClick={() => {
                                      // Get current store data
                                      const storeData = useOnboardingStore.getState().data;
                                      alert("Current store data: " + JSON.stringify(storeData, null, 2));
                                    }}
                                  >
                                    <Bug size={10} /> Check Store
                                  </button>
                                )}
                              </div>
                              <div>
                                <div>Has data obj: {(part as any).data ? "YES" : "NO"}</div>
                                <div>hasProfileData: {String((part as any).data?.hasProfileData)}</div>
                                <div>onboardingData: {(part as any).data?.onboardingData ? 
                                  `YES (keys: ${Object.keys((part as any).data?.onboardingData || {}).join(', ')})` : 
                                  "NO"}</div>
                                <div>test_id: {(part as any).data?.test_id || "NONE"}</div>
                              </div>
                            </div>
                          
                            {/* Check if profile data is available using the hasProfileData flag */}
                            {(part as any).data?.hasProfileData ? (
                              <div className="text-xs border-b border-primary-foreground/30 pb-2 mb-2 text-primary-foreground">
                                <div className="font-bold mb-1 flex items-center gap-1">
                                  <span>📋</span> FOUNDER PROFILE
                                  <span className="ml-1 bg-primary-foreground/20 px-1 rounded text-[10px]">
                                    {(part as any).data?.test_id || 'ID: N/A'}
                                  </span>
                                </div>
                                <div 
                                  className="flex items-center gap-1 cursor-pointer text-primary-foreground/70 hover:text-primary-foreground"
                                  onClick={() => setShowProfileData(!showProfileData)}
                                >
                                  {showProfileData ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  <span>
                                    {showProfileData ? "Hide profile data" : "Show profile data"}
                                  </span>
                                </div>
                                
                                {showProfileData && (
                                  <div className="mt-2 p-2 bg-black/10 rounded text-primary-foreground/80 max-h-48 overflow-y-auto">
                                    <pre className="text-xs whitespace-pre-wrap">
                                      {JSON.stringify((part as any).data.onboardingData, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs border-b border-primary-foreground/30 pb-2 mb-2 text-primary-foreground">
                                <div className="font-bold mb-1 flex items-center gap-1">
                                  <span>⚠️</span> NO PROFILE DATA
                                </div>
                                <div>
                                  Complete your profile in the <a href="/onboarding" className="underline hover:text-primary-foreground/80">onboarding section</a> to personalize responses
                                </div>
                              </div>
                            )}
                            
                            <Markdown>{(part as any).data?.originalInput || part.text}</Markdown>
                          </>
                        ) : (
                          <Markdown>{part.text}</Markdown>
                        )}
                      </div>
                    </div>
                  );
                }

                if (mode === 'edit') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              if (type === 'tool-invocation') {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'call') {
                  const { args } = toolInvocation;

                  return (
                    <div
                      key={toolCallId}
                      className={cx({
                        skeleton: ['getWeather'].includes(toolName),
                      })}
                    >
                      {toolName === 'getWeather' ? (
                        <Weather />
                      ) : toolName === 'createDocument' ? (
                        <DocumentPreview isReadonly={isReadonly} args={args} />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolCall
                          type="update"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolCall
                          type="request-suggestions"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : null}
                    </div>
                  );
                }

                if (state === 'result') {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === 'createDocument' ? (
                        <DocumentPreview
                          isReadonly={isReadonly}
                          result={result}
                        />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolResult
                          type="update"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolResult
                          type="request-suggestions"
                          result={result}
                          isReadonly={isReadonly}
                        />
                      ) : (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      )}
                    </div>
                  );
                }
              }
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
          <div className="translate-y-px">
            <SparklesIcon size={14} />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            <div className="flex gap-2 items-center">
              <span className="animate-pulse">💡</span>
              <span>Analyzing your startup question...</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
