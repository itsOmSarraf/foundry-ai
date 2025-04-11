'use client';

import type { Attachment, UIMessage } from 'ai';
import cx from 'classnames';
import type React from 'react';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from 'react';
import { toast } from 'sonner';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { generateUUID } from '@/lib/utils';

import { ArrowUpIcon, StopIcon } from './icons';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SuggestedActions } from './suggested-actions';
import equal from 'fast-deep-equal';
import type { UseChatHelpers, CreateMessage } from '@ai-sdk/react';

// Define type for onboarding data (can be imported if defined elsewhere)
interface OnboardingData { 
  [key: string]: any; 
}

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  messages,
  setMessages,
  append,
}: {
  chatId: string;
  input: UseChatHelpers['input'];
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  stop: () => void;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  append: UseChatHelpers['append'];
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const { data: onboardingData } = useOnboardingStore();
  
  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px';
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || '';
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    window.history.replaceState({}, '', `/chat/${chatId}`);

    const currentInput = input.trim();
    const testId = `submit-${Date.now()}`;

    // Ensure data payload is JSON-serializable
    let dataPayload: { 
      originalInput: string;
      test_id: string;
      onboardingContextForBackend?: string;
    };

    let finalMessageContent = currentInput;
    const isFirstMessage = messages.length === 0;

    if (isFirstMessage && onboardingData && Object.keys(onboardingData).length > 0) {
      try {
        const relevantData = { ...onboardingData };
        delete relevantData.test_timestamp; 
        const onboardingContext = `User Profile Context:\n${JSON.stringify(relevantData, null, 2)}`;
        finalMessageContent = `${onboardingContext}\n\n${currentInput}`;
      } catch (e) {
        console.error("Failed to stringify onboarding data:", e);
        finalMessageContent = currentInput;
      }
    }
    
    dataPayload = {
      originalInput: currentInput,
      test_id: testId,
      ...(onboardingData && { onboardingContextForBackend: onboardingData[Object.keys(onboardingData)[0]] })
    };

    setInput("");
    setLocalStorageInput('');
    resetHeight();

    const userMessage: CreateMessage = {
      id: generateUUID(),
      role: 'user',
      content: finalMessageContent,
      createdAt: new Date(),
      data: dataPayload
    };

    console.log("MultimodalInput submitForm: Appending message:", userMessage);

    append(userMessage);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    append,
    setLocalStorageInput,
    width,
    chatId,
    input,
    setInput,
    messages,
    onboardingData
  ]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && (
          <SuggestedActions append={append} chatId={chatId} />
        )}

      <div className={cx("relative flex w-full")}>
        <Textarea
          ref={textareaRef}
          placeholder="Ask me anything about your startup... e.g. 'What government schemes support AI startups in India?'"
          value={input}
          onChange={handleInput}
          className={cx(
            'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700',
          )}
          rows={2}
          autoFocus
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();

              if (status !== 'ready') {
                toast.error('Please wait for the model to finish its response!');
              } else {
                submitForm();
              }
            }
          }}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {status === 'streaming' ? (
            <PureStopButton stop={stop} setMessages={setMessages} />
          ) : (
            <PureSendButton submitForm={submitForm} input={input} />
          )}
        </div>
      </div>
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (!equal(prevProps, nextProps)) return false;

    return true;
  },
);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: UseChatHelpers['setMessages'];
}) {
  return (
    <Button
      data-testid="stop-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <StopIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
}: {
  submitForm: () => void;
  input: string;
}) {
  return (
    <Button
      data-testid="send-button"
      size="icon"
      variant="default"
      onClick={submitForm}
      disabled={!input.trim()}
    >
      <ArrowUpIcon />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
