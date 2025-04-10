import { auth } from '@/app/(auth)/auth';
import { getSuggestionsByDocumentId } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return new Response('Not Found', { status: 404 });
  }

  // const session = await auth();
  const session = { user: { id: 'temp-user-id' }, expires: 'temp-expires' }; // Temporarily disable auth

  /*
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  */

  const suggestions = await getSuggestionsByDocumentId({
    documentId,
  });

  const [suggestion] = suggestions;

  if (!suggestion) {
    return Response.json([], { status: 200 });
  }

  /*
  if (suggestion.userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }
  */
  // Skip user ID check

  return Response.json(suggestions, { status: 200 });
}
