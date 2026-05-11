// Import Dependencies
import { useAutoAnimate } from "@formkit/auto-animate/react";

// Local Imports
import { useTodoContext } from "../Todo.context";
import { TodoCard } from "./TodoCard";
import { getItemPosition } from "../utils";

// ----------------------------------------------------------------------

export function Todos() {
  const { todos, searchQuery } = useTodoContext();
  const [parent] = useAutoAnimate();

  const todoIndexMap = new Map(todos.map((todo, index) => [todo.id, index]));

  const normalizedQuery = searchQuery.toLowerCase().replace(/\s+/g, "");

  const visibleTodos = normalizedQuery
    ? todos.filter((todo) =>
        todo.title
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(normalizedQuery.toLowerCase()),
      )
    : todos;

  return (
    <div ref={parent} className="relative flex flex-col pt-4">
      {visibleTodos.map((todo) => {
        const originalIndex = todoIndexMap.get(todo.id);

        return (
          <TodoCard
            key={todo.id}
            todo={todo}
            index={originalIndex}
            position={getItemPosition({
              index: originalIndex,
              items: todos,
            })}
          />
        );
      })}
    </div>
  );
}
