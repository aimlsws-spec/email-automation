// Import Dependencies
import { forwardRef, useEffect, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import clsx from "clsx";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { dropTargetForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import { createPortal } from "react-dom";

// Local Imports
import { Box } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { mergeRefs, useDisclosure } from "hooks";
import { EditTask } from "../../../Modals/EditTask";
import { useBoardContext } from "../../../Board.context";
import { DropIndicator } from "components/shared/DropIndicator";
import { CardPrimitive } from "./CardPrimitive";

// ----------------------------------------------------------------------

const idleState = { type: "idle" };
const draggingState = { type: "dragging" };

export const TaskCard = forwardRef(({ data, columnData, ...rest }, ref) => {
  const { id, color } = data;

  const cardRef = useRef();
  const [closestEdge, setClosestEdge] = useState(null);
  const [draggableState, setDraggableState] = useState(idleState);

  const { cardSkin } = useThemeContext();
  const [isOpen, { open, close }] = useDisclosure();
  const { instanceId, registerCard } = useBoardContext();

  useEffect(() => {
    return registerCard({
      cardId: id,
      entry: {
        element: cardRef.current,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const element = cardRef.current;
    invariant(element);

    return combine(
      draggable({
        element: element,
        getInitialData: () => ({
          type: "card",
          instanceId,
          cardId: id,
          columnId: columnData.id,
        }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input,
            }),
            render({ container }) {
              setDraggableState({ type: "preview", container, rect });
              return () => setDraggableState(draggingState);
            },
          });
        },

        onDragStart: () => setDraggableState(draggingState),
        onDrop: () => setDraggableState(idleState),
      }),
      dropTargetForExternal({
        element: element,
      }),
      dropTargetForElements({
        element: element,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: "card", cardId: id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.cardId !== id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.cardId !== id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      }),
    );
  }, [columnData.id, id, instanceId, registerCard]);

  return (
    <>
      <Box
        data-task-id={id}
        onClick={open}
        role="button"
        className={clsx(
          "flex cursor-pointer flex-col rounded-lg border shadow-xs",
          [
            cardSkin === "shadow"
              ? "border-gray-100 bg-white dark:border-dark-700 dark:bg-dark-700"
              : color === "neutral"
                ? "border-gray-200 dark:border-dark-600"
                : "border-transparent",

            draggableState.type === "dragging" && "opacity-50",
          ],
        )}
        ref={mergeRefs(ref, cardRef)}
        {...rest}
      >
        <CardPrimitive data={data} />
        {closestEdge && <DropIndicator edge={closestEdge} gap="13px" />}
      </Box>
      {draggableState.type === "preview" &&
        createPortal(
          <Box
            style={{ width: draggableState.rect.width }}
            className="box-border rounded-lg bg-gray-300 backdrop-blur-xs dark:bg-dark-600"
          >
            <CardPrimitive data={data} />
          </Box>,
          draggableState.container,
        )}
      <EditTask
        isOpen={isOpen}
        close={close}
        data={data}
        columnData={columnData}
      />
    </>
  );
});

TaskCard.displayName = "TaskCard";

TaskCard.propTypes = {
  data: PropTypes.object,
  columnData: PropTypes.object,
};
