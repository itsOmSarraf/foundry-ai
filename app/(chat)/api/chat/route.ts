import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
  generateText,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import type { GoogleGenerativeAIProviderMetadata, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';

export const maxDuration = 60;

export async function POST(request: Request) {
  console.log('POST /api/chat: Request received');
  try {
    const requestData = await request.json();
    console.log('Request data:', JSON.stringify({
      id: requestData.id,
      messageCount: requestData.messages?.length || 0,
      selectedChatModel: requestData.selectedChatModel,
    }));

    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = requestData;

    console.log(`Using chat model: ${selectedChatModel}`);

    // const session = await auth();
    const session = { user: { id: 'temp-user-id' }, expires: 'temp-expires' }; // Temporarily disable auth

    // Temporarily disable auth check
    /*
    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }
    */

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      console.log('No user message found');
      return new Response('No user message found', { status: 400 });
    }

    // Check if the message contains enhanced input data
    let enhancedUserMessage = { ...userMessage };
    const lastTextPart = userMessage.parts.find(part => part.type === 'text');
    
    if (lastTextPart && (lastTextPart as any).data?.enhancedInput) {
      // Check if profile data exists
      const hasProfileData = !!(lastTextPart as any).data?.hasProfileData;
      
      console.log(`Profile data status: ${hasProfileData ? 'PRESENT' : 'MISSING'}`);
      if (hasProfileData) {
        console.log("Profile text sample:", (lastTextPart as any).data?.profileText?.substring(0, 100) + '...');
      }
      
      // Replace the text with the enhanced input that includes profile data
      enhancedUserMessage = {
        ...userMessage,
        parts: userMessage.parts.map(part => {
          if (part.type === 'text') {
            return {
              ...part,
              // Use enhanced input text for AI processing
              text: (part as any).data.enhancedInput,
              // Preserve the original data for reference
              data: {
                ...(part as any).data,
                isEnhanced: true
              }
            };
          }
          return part;
        })
      };
      
      console.log('Enhanced user message with profile data');
    } else {
      console.log('No enhanced input data found in message');
    }

    console.log('User message:', JSON.stringify({
      id: userMessage.id,
      parts: userMessage.parts.map(part => 
        part.type === 'text' ? 
          { type: 'text', text: (part.text || '').substring(0, 100) + (part.text?.length > 100 ? '...' : '') } : 
          { type: part.type }
      ),
    }));

    // Use the enhanced message for the rest of the processing
    const modifiedMessages = messages.map(msg => 
      msg.id === userMessage.id ? enhancedUserMessage : msg
    );

    // Configure provider options based on model
    const providerOptions: { google?: GoogleGenerativeAIProviderOptions } = {};
    
    if (selectedChatModel === 'image-model') {
      // Enable both text and image output for image model
      providerOptions.google = {
        responseModalities: ['TEXT', 'IMAGE'],
      };
    }

    console.log('Provider options:', JSON.stringify(providerOptions));

    // Use streaming response as expected by the useChat hook
    return createDataStreamResponse({
      execute: (dataStream) => {
        console.log('Starting streaming response');
        console.time('streamText');
        
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages: modifiedMessages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
          },
          onFinish: async ({ response }) => {
            console.timeEnd('streamText');
            console.log('Stream completed');
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
          providerOptions,
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error('Error in dataStream:', error);
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  console.log('DELETE /api/chat: Request received');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    console.log('No ID provided in DELETE request');
    return new Response('Not Found', { status: 404 });
  }

  console.log(`Deleting chat with ID: ${id}`);

  // const session = await auth();
  const session = { user: { id: 'temp-user-id' }, expires: 'temp-expires' }; // Temporarily disable auth

  // Temporarily disable auth check
  /*
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  */

  try {
    // const chat = await getChatById({ id }); // Temporarily disable chat check

    // Temporarily disable user ID check
    /*
    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }
    */
    // Skip user ID check

    // await deleteChatById({ id }); // Temporarily disable delete
    console.log(`Successfully processed delete for chat ID: ${id}`);

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/chat:', error);
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
