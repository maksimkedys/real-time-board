import { notFound, redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import {
  getBoardById,
  getBoardContent,
} from '@/entities/board/api/board.queries';
import { BoardDetailsView } from '@/features/boards/ui/board-details-view';

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  if (!user) redirect('/sign-in');

  const resolvedParams = await params;
  const boardId = resolvedParams.id;

  const board = await getBoardById(boardId);

  if (!board) {
    notFound();
  }

  const { columns, cards } = await getBoardContent(boardId);

  return (
    <BoardDetailsView
      board={board}
      initialColumns={columns}
      initialCards={cards}
    />
  );
}
