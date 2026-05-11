// Import Dependencies
import PropTypes from "prop-types";
import { FaListCheck } from "react-icons/fa6";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

// Local Imports
import { Avatar, Box, ScrollShadow } from "components/ui";
import { ActionMenu } from "./ActionMenu";
import { AddTask } from "./Task/AddTask";
import { useBoardContext } from "../../Board.context";
import { TaskCard } from "./Task/TaskCard";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { DropIndicator } from "components/shared/DropIndicator";

// ----------------------------------------------------------------------

const isSafari = getUserAgentBrowser() === "Safari";
const idle = { type: "idle" };
const dragging = { type: "dragging" };

export function Column({ data, tasks }) {
  const { id, color, Icon, name } = data;
  const [colDraggableState, setColDraggableState] = useState(idle);
  const [cardDraggableState, setCardDraggableState] = useState(idle);
  const tasksWrapperRef = useRef();
  const headerRef = useRef();
  const columnRef = useRef();
  const addTaskBtnRef = useRef();

  const { instanceId, registerColumn } = useBoardContext();

  const scrollToBottom = () => {
    tasksWrapperRef?.current.scrollTo({
      top: tasksWrapperRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const column = columnRef.current;
    const header = headerRef.current;
    const tasksWrapper = tasksWrapperRef.current;
    invariant(column);
    invariant(header);
    invariant(tasksWrapper);

    return combine(
      registerColumn({
        columnId: id,
        entry: {
          element: column,
        },
      }),
      draggable({
        element: column,
        dragHandle: header,
        getInitialData: () => ({ columnId: id, type: "column", instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          if (!isSafari) return;

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setColDraggableState({
                type: "preview-safari-column",
                container,
              });
              return () => setColDraggableState(dragging);
            },
          });
        },
        onDragStart: () => {
          setColDraggableState(dragging);
        },
        onDrop() {
          setColDraggableState(idle);
        },
      }),
      dropTargetForElements({
        element: tasksWrapper,
        getData: () => ({ columnId: id }),
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        onDragEnter: () => setCardDraggableState(dragging),
        onDragLeave: () => setCardDraggableState(idle),
        onDragStart: () => setCardDraggableState(dragging),
        onDrop: () => setCardDraggableState(idle),
      }),
      dropTargetForElements({
        element: column,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId &&
            source.data.type === "column"
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId: id,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragEnter: (args) => {
          setColDraggableState({
            type: "is-column-over",
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: (args) => {
          // skip react re-render if edge is not changing
          setColDraggableState((current) => {
            const closestEdge = extractClosestEdge(args.self.data);
            if (
              current.type === "is-column-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return {
              type: "is-column-over",
              closestEdge,
            };
          });
        },
        onDragLeave: () => {
          setColDraggableState(idle);
        },
        onDrop: () => {
          setColDraggableState(idle);
        },
      }),
      autoScrollForElements({
				element: tasksWrapper,
				canScroll: ({ source }) =>
					source.data.instanceId === instanceId && source.data.type === 'card',
			})
    );
  });

  const tasksList = data.tasks.filter(Boolean);

  return (
    <div
      className={clsx(
        "relative -mx-0.5 flex h-full shrink-0 flex-col rounded-lg px-0.5 ring-inset",
        cardDraggableState.type === "dragging" &&
          "bg-gray-100 dark:bg-surface-3",
      )}
    >
      <div
        ref={columnRef}
        className={clsx(
          "relative flex max-h-full w-72 shrink-0 flex-col rounded-lg",
          colDraggableState.type === "dragging" && "opacity-60",
        )}
      >
        <div
          ref={headerRef}
          className="flex min-w-0 items-center justify-between pb-1"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Avatar
              size={8}
              initialColor={color}
              initialVariant={color === "neutral" ? "filled" : "soft"}
              classNames={{
                display: "rounded-lg",
              }}
            >
              {Icon ? (
                <Icon className="size-4" />
              ) : (
                <FaListCheck className="size-4" />
              )}
            </Avatar>
            <span className="truncate text-base text-gray-800 dark:text-dark-100">
              {name}
            </span>
          </div>
          <ActionMenu columnId={id} />
        </div>
        <ScrollShadow
          ref={tasksWrapperRef}
          className="hide-scrollbar relative space-y-2.5 overflow-y-auto pt-1.5"
        >
          {tasksList?.length > 0 ? (
            tasksList.map((taskId, i) => {
              const task = tasks.filter((task) => task.id === taskId)[0];
              return (
                <TaskCard
                  data={task}
                  columnData={data}
                  index={i}
                  key={taskId}
                />
              );
            })
          ) : (
            <div>
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <div className="flex items-center gap-2 text-gray-600 dark:text-dark-300">
                  <span className="text-xl">👀</span>
                  <span className="text-lg">No tasks</span>
                </div>
                <button
                  onClick={() => addTaskBtnRef.current.click()}
                  className="text-center text-sm text-gray-400 dark:text-dark-300"
                >
                  Add tasks here to get started
                </button>
              </div>
            </div>
          )}
        </ScrollShadow>

        <AddTask
          columnId={id}
          scrollToBottom={scrollToBottom}
          addTaskBtnRef={addTaskBtnRef}
        />
      </div>
      {colDraggableState.type === "is-column-over" &&
        colDraggableState.closestEdge && (
          <DropIndicator edge={colDraggableState.closestEdge} gap="13px" />
        )}
      {colDraggableState.type === "preview-safari-column"
        ? createPortal(
            <Box className="h-5 max-w-sm rounded-sm bg-gray-200 px-1 py-0.5 text-black dark:bg-dark-800 dark:text-white">
              {name}
            </Box>,
            colDraggableState.container,
          )
        : null}
    </div>
  );
}

Column.propTypes = {
  data: PropTypes.object,
  tasks: PropTypes.array,
  index: PropTypes.number,
};
