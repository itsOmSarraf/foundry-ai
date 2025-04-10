import { auth } from '@/app/(auth)/auth';
import { getChatById, getVotesByChatId, voteMessage } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new Response('chatId is required', { status: 400 });
  }

  // const session = await auth();
  const session = { user: { id: 'temp-user-id', email: 'temp@example.com' }, expires: 'temp-expires' }; // Temporarily disable auth

  /*
  if (!session || !session.user || !session.user.email) {
    return new Response('Unauthorized', { status: 401 });
  }
  */

  // const chat = await getChatById({ id: chatId }); // Temporarily disable DB fetch
  const chat = { userId: 'temp-user-id' }; // Provide mock object

  /* // Temporarily disable check
  if (!chat) {
    return new Response('Chat not found', { status: 404 });
  }
  */

  /*
  if (chat.userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }
  */
  // Skip user ID check

  const votes = await getVotesByChatId({ id: chatId });

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const {
    chatId,
    messageId,
    type,
  }: { chatId: string; messageId: string; type: 'up' | 'down' } =
    await request.json();

  if (!chatId || !messageId || !type) {
    return new Response('messageId and type are required', { status: 400 });
  }

  // const session = await auth();
  // const session = { user: { id: 'temp-user-id', email: 'temp@example.com' }, expires: 'temp-expires' }; // Use the same mock session as above

  /*
  if (!session || !session.user || !session.user.email) {
    return new Response('Unauthorized', { status: 401 });
  }
  */

  // const chat = await getChatById({ id: chatId }); // Temporarily disable DB fetch
  const chat = { userId: 'temp-user-id' }; // Provide mock object

  /* // Temporarily disable check
  if (!chat) {
    return new Response('Chat not found', { status: 404 });
  }
  */

  /*
  if (chat.userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }
  */
  // Skip user ID check

  // await voteMessage({ // Temporarily disable DB update
  //   chatId,
  //   messageId,
  //   type: type,
  // });

  return new Response('Message voted', { status: 200 });
}
