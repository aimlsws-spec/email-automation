// Import Dependencies
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { Button, Card } from "components/ui";
import { useChatContext } from "../Chat.context";

// ----------------------------------------------------------------------

const defaultMessages = [
  {
    id: "1",
    content:
      "Don't worry, this update is quicker than your internet history deletion!",
  },
  {
    id: "2",
    content:
      "A majestic bird soars high above a crystal-clear glacial lake, its wings catching the sunlight.",
  },
  {
    id: "3",
    content:
      "For Wallace the walrus, the perfect day starts with a leisurely swim in the icy Arctic waters",
  },
  {
    id: "4",
    content:
      "The best time to stretch is whenever your body feels tight or stiff!",
  },
];

export function Placeholder() {
  const { newMessage, currentChat } = useChatContext();

  return (
    <div className="mx-auto flex w-full max-w-4xl grow flex-col overflow-y-auto pb-3 pt-[clamp(2.5rem,10vh,20vh)]">
      <div className="px-4 text-[clamp(2.2rem,3.75vw,3.75rem)] font-medium leading-[1.1] tracking-tight">
        <span
          style={{
            animationDuration: "5s",
            backgroundSize: "200% 100%",
          }}
          className="block animate-shimmer bg-linear-to-r from-violet-400 via-red-400 to-fuchsia-400 bg-clip-text font-semibold text-transparent"
        >
          Welcome, John Doe
        </span>
        <span className="block text-gray-400 dark:text-dark-300">
          May I be of assistance today?
        </span>
      </div>
      <div className="flex w-full shrink-0 gap-4 px-4 pt-16 max-lg:overflow-x-auto lg:grid lg:grid-cols-4">
        {defaultMessages.map((message, i) => (
          <Card
            onClick={() => newMessage(currentChat?.id, message)}
            key={message.id}
            className={clsx(
              "group flex shrink-0 flex-col p-3 max-lg:w-48",
              i % 2 === 0 ? "lg:-rotate-3" : "lg:rotate-3",
            )}
          >
            <div className="grow">
              <h3>{message.content}</h3>
            </div>

            <div className="flex justify-end pt-6">
              <Button component="div" isIcon className="size-8 rounded-full">
                <ArrowUpRightIcon className="size-4" />
              </Button>
            </div>

            <div className="absolute inset-0 cursor-pointer rounded-lg bg-black/10 opacity-0 transition-colors group-hover:opacity-100" />
          </Card>
        ))}
      </div>
    </div>
  );
}
