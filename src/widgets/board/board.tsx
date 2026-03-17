import { Button } from '@/shared/ui/button';
import { sortItems } from '../../utils';

import type {
  Workspace,
  Board,
  Column,
  Card,
} from '@/shared/types/models.types';

type BoardViewData = {
  workspace: Workspace;
  board: Board;
  columns: Column[];
  cardsByColumnId: Record<string, Card[]>;
};

export function Board({ data }: { data: BoardViewData }) {
  const sortedColumns = sortItems(data.columns);

  return (
    <div className="flex h-[calc(100vh-4.5rem)] flex-col gap-4 bg-board-bg px-4 py-4">
      <header className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">Workspace</div>
          <div className="truncate text-sm font-semibold">
            {data.workspace.name}
          </div>
        </div>
        <Button size="sm" variant="secondary">
          + New task
        </Button>
      </header>

      <div className="flex flex-1 gap-4 overflow-x-auto pb-2">
        {sortedColumns.map((column) => {
          const cards = data.cardsByColumnId[column.id] ?? [];
          const sortedCards = sortItems(cards);

          return (
            <section
              key={column.id}
              className="flex w-72 shrink-0 flex-col rounded-xl bg-board-column p-3 shadow-sm ring-1 ring-(--board-card-border)"
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {column.title}
                </h2>
                <span className="rounded-full bg-board-accent-soft px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-100">
                  {cards.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 overflow-y-auto pt-1">
                {sortedCards.map((card) => (
                  <article
                    key={card.id}
                    className="group rounded-lg bg-board-card p-3 text-xs shadow-sm ring-1 ring-(--board-card-border) transition-shadow hover:shadow-md"
                  >
                    <h3 className="mb-1 text-[13px] font-semibold text-foreground">
                      {card.title}
                    </h3>
                    {card.description ? (
                      <p className="line-clamp-3 text-[11px] text-muted-foreground">
                        {card.description}
                      </p>
                    ) : null}
                  </article>
                ))}

                {cards.length === 0 && (
                  <div className="mt-1 rounded-md border border-dashed border-(--board-card-border) bg-board-card/40 px-2 py-3 text-center text-[11px] text-muted-foreground">
                    No tasks yet
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
