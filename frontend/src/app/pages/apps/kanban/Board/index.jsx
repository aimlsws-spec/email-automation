// Local Imports
import { useBoardContext } from "../Board.context";
import { AddColumnButton } from "./AddColumnButton";
import { Column } from "./Column";
import { NoBoardsFound } from "./NoBoardsFound";

// ----------------------------------------------------------------------

export function Board() {
  const { currentBoard } = useBoardContext();

  if (!currentBoard) {
    return <NoBoardsFound />;
  }

  return (
    <div className="grid h-[calc(100vh-7.25rem)] grid-cols-1 supports-[width:1dvh]:h-[calc(100dvh-7.25rem)]">
      <div
        className="custom-scrollbar sm:pt-4 transition-content flex w-full items-start gap-x-4 overflow-x-auto overflow-y-hidden px-(--margin-x)"
        style={{
          "--scrollbar-size": "0.625rem",
          "--margin-scroll": "var(--margin-x)",
        }}
      >
        {currentBoard.columns.map((column, i) => (
          <Column
            data={column}
            key={column.id}
            index={i}
            tasks={currentBoard.tasks}
          />
        ))}
        <AddColumnButton />
      </div>
    </div>
  );
}
