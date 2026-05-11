// Import Dependencies
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import invariant from "tiny-invariant";

// Local Imports
import { BoardContextProvider } from "./Board.context";
import { fakeBoards } from "./data";
import { randomId } from "utils/randomId";
import { stringToSlug } from "utils/stringToSlug";
import { triggerPostMoveFlash } from "utils/dom/triggerPostMoveFlash";
import { createRegistry } from "./utils";

// ----------------------------------------------------------------------

const initialState = {
  boards: fakeBoards,
  activeBoardId: fakeBoards?.[0]?.id,
  lastMoved: null,
};

const ACTIONS = {
  CREATE_BOARD: "CREATE_BOARD",
  DELETE_BOARD: "DELETE_BOARD",
  UPDATE_BOARD: "UPDATE_BOARD",
  CREATE_COLUMN: "CREATE_COLUMN",
  DELETE_COLUMN: "DELETE_COLUMN",
  UPDATE_COLUMN: "UPDATE_COLUMN",
  CREATE_TASK: "CREATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  REORDER_TASK: "REORDER_TASK",
  MOVE_TASK: "MOVE_TASK",
  REORDER_COLUMN: "REORDER_COLUMN",
};

const reducerHandlers = {
  [ACTIONS.SET_ACTIVE_BOARD]: (state, payload) => ({
    ...state,
    activeBoardId: payload,
  }),

  [ACTIONS.CREATE_BOARD]: (state, payload) => {
    const newColumns = payload.columns?.filter(Boolean).map((column) => ({
      id: randomId(),
      name: column.name,
      slug: stringToSlug(column.name),
      color: column.color,
      tasks: [],
    }));

    const newBoard = {
      ...payload,
      id: randomId(),
      columns: newColumns,
      tasks: [],
      slug: stringToSlug(payload.name),
    };

    return {
      ...state,
      boards: [...state.boards, newBoard],
      activeBoardId: newBoard.id,
    };
  },

  [ACTIONS.DELETE_BOARD]: (state, payload) => {
    const restBoards = state.boards.filter((board) => board.id !== payload);
    return {
      ...state,
      boards: restBoards,
      activeBoardId: restBoards[0]?.id || null,
    };
  },

  [ACTIONS.UPDATE_BOARD]: (state, payload) => {
    const currentBoard = state.boards.find(
      (board) => board.id === state.activeBoardId,
    );

    const updatedColumns = payload.columns.map((column) => {
      if (column.id) {
        const colData = currentBoard.columns.find((c) => c.id === column.id);

        return {
          ...colData,
          name: column.name,
          slug: stringToSlug(column.name),
          color: column.color,
        };
      }

      return {
        id: randomId(),
        name: column.name,
        slug: stringToSlug(column.name),
        color: column.color,
        tasks: [],
      };
    });

    const updatedBoards = state.boards.map((board) =>
      board.id === state.activeBoardId
        ? {
            ...board,
            name: payload.name,
            isPrivate: payload.isPrivate,
            columns: updatedColumns,
          }
        : board,
    );

    return {
      ...state,
      boards: updatedBoards,
    };
  },

  [ACTIONS.CREATE_COLUMN]: (state, payload) => {
    const newColumn = {
      ...payload,
      id: randomId(),
      tasks: [],
    };

    const updatedBoards = state.boards.map((board) =>
      board.id === state.activeBoardId
        ? { ...board, columns: [...board.columns, newColumn] }
        : board,
    );

    return {
      ...state,
      boards: updatedBoards,
    };
  },

  [ACTIONS.DELETE_COLUMN]: (state, payload) => {
    const updatedBoards = state.boards.map((board) =>
      board.id === state.activeBoardId
        ? {
            ...board,
            columns: board.columns.filter((column) => column.id !== payload),
          }
        : board,
    );

    return {
      ...state,
      boards: updatedBoards,
    };
  },

  [ACTIONS.UPDATE_COLUMN]: (state, payload) => {
    const updatedBoards = state.boards.map((board) => {
      if (board.id != state.activeBoardId) return board;

      const updatedColumns = board.columns.map((column) =>
        column.id === payload.id
          ? {
              ...column,
              name: payload.name,
              slug: stringToSlug(payload.name),
              color: payload.color,
            }
          : column,
      );
      return { ...board, columns: updatedColumns };
    });

    return {
      ...state,
      boards: updatedBoards,
    };
  },

  [ACTIONS.CREATE_TASK]: (state, { columnId, task }) => {
    const currentBoard = state.boards.find(
      (board) => board.id === state.activeBoardId,
    );
    const column = currentBoard.columns.find((col) => col.id === columnId);

    const newTask = {
      id: randomId(),
      title: task.title,
      slug: stringToSlug(task.title),
      description: "",
      cover: null,
      status: column.slug,
      color: "neutral",
      labels: [],
      members: [],
      commentsCount: 0,
      attachmentsCount: 0,
      dueDate: null,
    };

    const updatedBoards = state.boards.map((board) => {
      if (board.id != state.activeBoardId) return board;

      const updatedColumns = board.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask.id] }
          : col,
      );

      return {
        ...board,
        tasks: [...board.tasks, newTask],
        columns: updatedColumns,
      };
    });

    return {
      ...state,
      boards: updatedBoards,
    };
  },

  [ACTIONS.DELETE_TASK]: (state, payload) => {
    const currentBoard = state.boards.find(
      (board) => board.id === state.activeBoardId,
    );

    const taskToDelete = currentBoard.tasks.find((task) => task.id === payload);

    const updatedBoards = state.boards.map((board) => {
      if (board.id != state.activeBoardId) return board;

      const updatedColumns = board.columns.map((column) =>
        column.slug === taskToDelete.status
          ? {
              ...column,
              tasks: column.tasks.filter((id) => id !== payload),
            }
          : column,
      );
      return {
        ...board,
        tasks: board.tasks.filter((task) => task.id !== payload),
        columns: updatedColumns,
      };
    });

    return {
      ...state,
      boards: updatedBoards,
    };
  },

  [ACTIONS.UPDATE_TASK]: (state, { taskId, updatedTask }) => {
    const updatedBoards = state.boards.map((board) => {
      if (board.id != state.activeBoardId) return board;

      const updatedTasks = board.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: updatedTask.title,
              slug: stringToSlug(updatedTask.title),
              description: updatedTask.description,
              color: updatedTask.color,
              labels: updatedTask.labels,
              members: updatedTask.members,
              dueDate: updatedTask.dueDate,
            }
          : task,
      );
      return { ...board, tasks: updatedTasks };
    });

    return {
      ...state,
      boards: updatedBoards,
    };
  },

  [ACTIONS.REORDER_TASK]: (state, payload) => {
    const { cardId, columnId, startIndex, finishIndex, trigger } = payload;

    const updatedBoards = state.boards.map((board) => {
      if (board.id != state.activeBoardId) return board;

      const updatedCols = board.columns.map((col) => {
        if (col.id !== columnId) return col;

        const reordered = reorder({
          list: col.tasks,
          startIndex,
          finishIndex,
        });

        return {
          ...col,
          tasks: reordered,
        };
      });
      return { ...board, columns: updatedCols };
    });

    return {
      ...state,
      boards: updatedBoards,
      lastMoved: {
        trigger: trigger,
        outcome: {
          type: "card-reorder",
          cardId,
          columnId,
          startIndex,
          finishIndex,
        },
      },
    };
  },

  [ACTIONS.MOVE_TASK]: (state, payload) => {
    const {
      cardId,
      startColumnId,
      finishColumnId,
      itemIndexInStartColumn,
      itemIndexInFinishColumn,
      trigger,
    } = payload;

    const updatedBoards = state.boards.map((board) => {
      if (board.id != state.activeBoardId) return board;

      const sourceColumn = board.columns.find(
        (col) => col.id === startColumnId,
      );

      const destinationColumn = board.columns.find(
        (col) => col.id === finishColumnId,
      );

      const newIndexInDestination = itemIndexInFinishColumn ?? 0;

      if (!destinationColumn.tasks.includes(cardId)) {
        destinationColumn.tasks.splice(newIndexInDestination, 0, cardId);
        sourceColumn.tasks.splice(itemIndexInStartColumn, 1);
      }

      return {
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === startColumnId) return { ...sourceColumn };
          if (col.id === finishColumnId) return { ...destinationColumn };
          return col;
        }),
      };
    });

    return {
      ...state,
      boards: updatedBoards,
      lastMoved: {
        trigger: trigger,
        outcome: {
          type: "card-move",
          cardId,
          startColumnId,
          finishColumnId,
          itemIndexInStartColumn,
          itemIndexInFinishColumn,
        },
      },
    };
  },

  [ACTIONS.REORDER_COLUMN]: (state, payload) => {
    const { columnId, startIndex, finishIndex, trigger } = payload;

    const updatedBoards = state.boards.map((board) => {
      if (board.id != state.activeBoardId) return board;

      const reordered = reorder({
        list: board.columns,
        startIndex,
        finishIndex,
      });

      return {
        ...board,
        columns: reordered,
      };
    });

    return {
      ...state,
      boards: updatedBoards,
      lastMoved: {
        trigger: trigger,
        outcome: {
          type: "column-reorder",
          columnId,
          startIndex,
          finishIndex,
        },
      },
    };
  },
};

const boardReducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action.payload) : state;
};

export function BoardProvider({ children }) {
  const [{ boards, activeBoardId, lastMoved }, dispatch] = useReducer(
    boardReducer,
    initialState,
  );

  const [registry] = useState(createRegistry);

  const [instanceId] = useState(() => Symbol("instance-id"));

  const currentBoard = boards.find((board) => board.id === activeBoardId);

  const reorderColumn = useCallback(
    ({ startIndex, columnId, finishIndex, trigger = "keyboard" }) => {
      dispatch({
        type: ACTIONS.REORDER_COLUMN,
        payload: {
          columnId,
          startIndex,
          finishIndex,
          trigger,
        },
      });
    },
    [dispatch],
  );

  const reorderTask = useCallback(
    ({ cardId, columnId, startIndex, finishIndex, trigger = "keyboard" }) => {
      dispatch({
        type: ACTIONS.REORDER_TASK,
        payload: {
          cardId,
          columnId,
          startIndex,
          finishIndex,
          trigger,
        },
      });
    },
    [dispatch],
  );

  const moveCard = useCallback(
    ({
      cardId,
      startColumnId,
      finishColumnId,
      itemIndexInStartColumn,
      itemIndexInFinishColumn,
      trigger = "keyboard",
    }) => {
      // invalid cross column movement
      if (startColumnId === finishColumnId) {
        return;
      }

      dispatch({
        type: ACTIONS.MOVE_TASK,
        payload: {
          startColumnId,
          finishColumnId,
          cardId,
          itemIndexInStartColumn,
          itemIndexInFinishColumn,
          trigger,
        },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    if (lastMoved === null) {
      return;
    }
    const { outcome } = lastMoved;

    if (outcome.type === "column-reorder") {
      const { columnId } = outcome;

      const entry = registry.getColumn(columnId);
      triggerPostMoveFlash(entry.element);
      return;
    }

    if (outcome.type === "card-move" || outcome.type === "card-reorder") {
      const { cardId } = outcome;

      const entry = registry.getCard(cardId);
      triggerPostMoveFlash(entry.element);
      return;
    }
  }, [lastMoved, registry]);

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }
          // need to handle drop
          // 1. remove element from original position
          // 2. move to new position

          if (source.data.type === "column") {
            const columnId = source.data.columnId;

            const startIndex = currentBoard.columns.findIndex(
              ({ id }) => id === columnId,
            );

            const target = location.current.dropTargets[0];

            const indexOfTarget = currentBoard.columns.findIndex(
              ({ id }) => id === target.data.columnId,
            );

            const closestEdgeOfTarget = extractClosestEdge(target.data);

            const finishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "horizontal",
            });

            reorderColumn({
              startIndex,
              finishIndex,
              columnId,
              trigger: "pointer",
            });
          }

          // Dragging a card
          if (source.data.type === "card") {
            const cardId = source.data.cardId;
            const sourceColumnId = source.data.columnId;

            invariant(typeof cardId === "string");
            invariant(typeof sourceColumnId === "string");

            const sourceColumn = currentBoard.columns.find(
              (c) => c.id === sourceColumnId,
            );

            const cardIndex = sourceColumn.tasks.findIndex((i) => i === cardId);

            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;

              const destinationId = destinationColumnRecord.data.columnId;

              invariant(typeof destinationId === "string");
              const destinationColumn = currentBoard.columns.find(
                ({ id }) => id === destinationId,
              );

              invariant(destinationColumn);

              // reordering in same column
              if (sourceColumn.id === destinationColumn.id) {
                const destinationIndex = getReorderDestinationIndex({
                  startIndex: cardIndex,
                  indexOfTarget: sourceColumn.items.length - 1,
                  closestEdgeOfTarget: null,
                  axis: "vertical",
                });
                reorderTask({
                  columnId: sourceColumn.id,
                  startIndex: cardIndex,
                  finishIndex: destinationIndex,
                  trigger: "pointer",
                });
                return;
              }

              // moving to a new column
              moveCard({
                cardId,
                itemIndexInStartColumn: cardIndex,
                startColumnId: sourceColumn.id,
                finishColumnId: destinationColumn.id,
                trigger: "pointer",
              });
              return;
            }

            // dropping in a column (relative to a card)
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] =
                location.current.dropTargets;

              const destinationColumnId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationColumnId === "string");
              const destinationColumn = currentBoard.columns.find(
                (c) => c.id === destinationColumnId,
              );

              const indexOfTarget = destinationColumn.tasks.findIndex(
                (i) => i === destinationCardRecord.data.cardId,
              );

              const closestEdgeOfTarget = extractClosestEdge(
                destinationCardRecord.data,
              );

              // case 1: ordering in the same column
              if (sourceColumn.id === destinationColumn.id) {
                const destinationIndex = getReorderDestinationIndex({
                  startIndex: cardIndex,
                  indexOfTarget,
                  closestEdgeOfTarget,
                  axis: "vertical",
                });

                if (cardIndex !== destinationIndex)
                  reorderTask({
                    cardId: cardId,
                    columnId: sourceColumn.id,
                    startIndex: cardIndex,
                    finishIndex: destinationIndex,
                    trigger: "pointer",
                  });

                return;
              }

              // case 2: moving into a new column relative to a card
              const destinationIndex =
                closestEdgeOfTarget === "bottom"
                  ? indexOfTarget + 1
                  : indexOfTarget;

              moveCard({
                cardId: cardId,
                itemIndexInStartColumn: cardIndex,
                startColumnId: sourceColumn.id,
                finishColumnId: destinationColumn.id,
                itemIndexInFinishColumn: destinationIndex,
                trigger: "pointer",
              });
            }
          }
        },
      }),
    );
  }, [currentBoard.columns, instanceId, moveCard, reorderColumn, reorderTask]);

  // Memoize dispatch functions to prevent unnecessary re-renders of consumers
  const dispatchFunctions = useMemo(
    () => ({
      setActiveBoardId: (boardId) =>
        dispatch({ type: ACTIONS.SET_ACTIVE_BOARD, payload: boardId }),

      createBoard: (board) =>
        dispatch({ type: ACTIONS.CREATE_BOARD, payload: board }),

      updateBoard: (updatedBoard) =>
        dispatch({
          type: ACTIONS.UPDATE_BOARD,
          payload: updatedBoard,
        }),

      deleteBoard: (boardId) =>
        dispatch({ type: ACTIONS.DELETE_BOARD, payload: boardId }),

      createColumn: (column) =>
        dispatch({ type: ACTIONS.CREATE_COLUMN, payload: column }),

      updateColumn: (updatedColumn) =>
        dispatch({ type: ACTIONS.UPDATE_COLUMN, payload: updatedColumn }),

      deleteColumn: (columnId) =>
        dispatch({ type: ACTIONS.DELETE_COLUMN, payload: columnId }),

      createTask: (columnId, task) =>
        dispatch({ type: ACTIONS.CREATE_TASK, payload: { columnId, task } }),

      updateTask: (taskId, updatedTask) =>
        dispatch({
          type: ACTIONS.UPDATE_TASK,
          payload: { taskId, updatedTask },
        }),

      deleteTask: (taskId) =>
        dispatch({ type: ACTIONS.DELETE_TASK, payload: taskId }),
    }),
    [dispatch],
  );

  const value = {
    boards,
    currentBoard,
    instanceId,
    registerCard: registry.registerCard,
    registerColumn: registry.registerColumn,
    ...dispatchFunctions,
  };

  return <BoardContextProvider value={value}>{children}</BoardContextProvider>;
}

BoardProvider.propTypes = {
  children: PropTypes.node,
};
