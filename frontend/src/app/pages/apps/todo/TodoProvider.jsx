// Import Dependencies
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { toast } from "sonner";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

// Local Imports
import { TodoContextProvider } from "./Todo.context";
import { randomId } from "utils/randomId";
import { stringToSlug } from "utils/stringToSlug";
import { fakeTodos } from "./data";
import { getItemRegistry, todoKey, isItemData } from "./utils";

// ----------------------------------------------------------------------
const initialState = {
  todos: fakeTodos,
  searchQuery: "",
  error: null,
};

const ACTIONS = {
  SET_TODOS: "SET_TODOS",
  CREATE_TODO: "CREATE_TODO",
  UPDATE_TODO: "UPDATE_TODO",
  DELETE_TODO: "DELETE_TODO",
  TOGGLE_IMPORTANT: "TOGGLE_IMPORTANT",
  TOGGLE_DONE: "TOGGLE_DONE",
  SET_SEARCH: "SET_SEARCH",
  REORDER_TODOS: "REORDER_TODOS",
  SET_ERROR: "SET_ERROR",
};

// Reducer Handlers
const reducerHandlers = {
  [ACTIONS.SET_TODOS]: (state, payload) => ({
    ...state,
    todos: payload,
    isLoading: false,
  }),

  [ACTIONS.CREATE_TODO]: (state, payload) => ({
    ...state,
    todos: [payload, ...state.todos],
  }),

  [ACTIONS.UPDATE_TODO]: (state, { id, updates }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo,
    ),
  }),

  [ACTIONS.DELETE_TODO]: (state, payload) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== payload),
  }),

  [ACTIONS.TOGGLE_IMPORTANT]: (state, { id, value }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, isImportant: value } : todo,
    ),
  }),

  [ACTIONS.TOGGLE_DONE]: (state, { id, value }) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: value } : todo,
    ),
  }),

  [ACTIONS.SET_SEARCH]: (state, payload) => ({
    ...state,
    searchQuery: payload,
  }),

  [ACTIONS.REORDER_TODOS]: (state, { startIndex, finishIndex }) => {
    const reorderedTodos = reorder({
      list: state.todos,
      startIndex,
      finishIndex,
    });

    return {
      ...state,
      todos: reorderedTodos,
    };
  },

  [ACTIONS.SET_ERROR]: (state, payload) => ({
    ...state,
    error: payload,
    isLoading: false,
  }),
};

const registry = getItemRegistry();

const instanceId = () => Symbol("instance-id");

const todoReducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action.payload) : state;
};

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { todos, searchQuery, error } = state;

  const reorderTodo = useCallback(
    ({ startIndex, indexOfTarget, closestEdgeOfTarget }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: "vertical",
      });

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return;
      }

      dispatch({
        type: ACTIONS.REORDER_TODOS,
        payload: { startIndex, finishIndex },
      });
    },
    [],
  );

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return (
          isItemData(source.data, todoKey) &&
          source.data.instanceId === instanceId
        );
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];

        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;

        if (
          !isItemData(sourceData, todoKey) ||
          !isItemData(targetData, todoKey)
        ) {
          return;
        }

        const indexOfTarget = todos.findIndex(
          (todo) => todo.id === targetData.todo.id,
        );

        if (indexOfTarget < 0) {
          return;
        }

        reorderTodo({
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget: extractClosestEdge(targetData),
        });
      },
    });
  }, [todos, reorderTodo]);

  const getListLength = useCallback(() => todos.length, [todos.length]);

  const createTodo = useCallback((todo) => {
    const newTodo = {
      ...todo,
      id: randomId(),
      slug: stringToSlug(todo.title),
      createdAt: new Date().toISOString(),
      isDone: false,
      isImportant: false,
    };

    dispatch({ type: ACTIONS.CREATE_TODO, payload: newTodo });
    toast.success("Todo created successfully");
  }, []);

  const updateTodo = useCallback((todoId, updates) => {
    const updatedTodo = {
      ...updates,
      slug: stringToSlug(updates.title),
      updatedAt: new Date().toISOString(),
    };

    dispatch({
      type: ACTIONS.UPDATE_TODO,
      payload: { id: todoId, updates: updatedTodo },
    });
    toast.success("Todo updated successfully");
  }, []);

  const deleteTodo = useCallback((todoId) => {
    dispatch({ type: ACTIONS.DELETE_TODO, payload: todoId });
    toast.success("Todo deleted successfully");
  }, []);

  const setIsImportant = useCallback((todoId, value) => {
    dispatch({
      type: ACTIONS.TOGGLE_IMPORTANT,
      payload: { id: todoId, value },
    });
  }, []);

  const setIsDone = useCallback((todoId, value) => {
    dispatch({
      type: ACTIONS.TOGGLE_DONE,
      payload: { id: todoId, value },
    });
    if (value) toast.success("Todo marked as done");
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: query });
  }, []);

  const value = useMemo(() => {
    return {
      todos,
      registerTodo: registry.register,
      error,
      createTodo,
      updateTodo,
      deleteTodo,
      setIsImportant,
      setIsDone,
      setSearchQuery,
      searchQuery,
      reorderTodo,
      instanceId,
      getListLength,
    };
  }, [
    createTodo,
    deleteTodo,
    error,
    getListLength,
    reorderTodo,
    searchQuery,
    setIsDone,
    setIsImportant,
    setSearchQuery,
    todos,
    updateTodo,
  ]);

  return <TodoContextProvider value={value}>{children}</TodoContextProvider>;
}

TodoProvider.propTypes = {
  children: PropTypes.node,
};
