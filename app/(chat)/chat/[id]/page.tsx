import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { DBMessage } from '@/lib/db/schema';
import { Attachment, UIMessage } from 'ai';

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  // const chat = await getChatById({ id });
  const chat = null; // Temporarily disable DB fetch

  // if (!chat) {
  //   notFound();
  // }

  // const session = await auth(); // Already commented out or handled elsewhere

  /* // Temporarily disable visibility/ownership checks
  if (chat?.visibility === 'private') {
    if (!session || !session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }
  */

  // const messagesFromDb = await getMessagesByChatId({
  //   id: params.id, // Use params.id here
  // });
  const messagesFromDb: DBMessage[] = []; // Provide empty array

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage['parts'],
      role: message.role as UIMessage['role'],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: '',
      createdAt: message.createdAt,
      experimental_attachments:
        (message.attachments as Array<Attachment>) ?? [],
    }));
  }

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  // Simplified return logic without conditional rendering based on cookie (can be added back later)
  return (
    <>
      <Chat
        key={params.id} // Use key here
        id={params.id} // Use params.id
        initialMessages={convertToUIMessages(messagesFromDb)} // Use converted empty array
        selectedChatModel={chatModelFromCookie?.value ?? DEFAULT_CHAT_MODEL}
        selectedVisibilityType={"private"} // Default to private
        isReadonly={false} // Default to false, removing session dependency
      />
      <DataStreamHandler id={params.id} />
    </>
  );

  /* // Original logic with cookie check - commented out for simplicity
  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          id={params.id} // Use params.id
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType={'private'} // Default to private
          isReadonly={false} // Default to false
        />
        <DataStreamHandler id={params.id} />
      </>
    );
  }

  return (
    <>
      <Chat
        id={params.id} // Use params.id
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedChatModel={chatModelFromCookie.value}
        selectedVisibilityType={'private'} // Default to private
        isReadonly={false} // Default to false
      />
      <DataStreamHandler id={params.id} />
    </>
  );
  */
}
