// Import Dependencies
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PiSlidersHorizontal } from "react-icons/pi";
import dayjs from "dayjs";
import { useState } from "react";

// Local Imports
import {
  Avatar,
  AvatarDot,
  Badge,
  Button,
  Input,
  ScrollShadow,
} from "components/ui";
import { Highlight } from "components/shared/Highlight";
import { useSidebarContext } from "app/contexts/sidebar/context";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { useChatContext } from "../../Chat.context";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

const today = dayjs();

function formatDate(date) {
  const diffInDays = today.diff(date, "day");

  if (diffInDays === 0) {
    // Today, show time
    return date.format("HH:mm"); // Adjust format for preferred time display (12h or 24h)
  } else if (diffInDays < 7 && diffInDays > 0) {
    // Last week, show weekday (short format)
    return date.format("ddd"); // ddd for short weekday (Mon, Tue, etc.)
  } else {
    // Other cases, show month (short format) + day
    return date.format("MMM D"); // MMM for short month (Sep, Oct, etc.), D for day of month
  }
}

export function Chats() {
  const { chats, currentChat, setActiveChatId } = useChatContext();
  const { close: closeSidebar } = useSidebarContext();
  const { lgAndDown } = useBreakpointsContext();
  const { cardSkin } = useThemeContext();
  const [query, setQuery] = useState("");

  const setCurrentChat = (chatId) => {
    setActiveChatId(chatId);
    setQuery("");
    if (lgAndDown) closeSidebar();
  };

  const filteredChats =
    query === ""
      ? chats
      : chats.filter((chat) =>
          chat.profile.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <div className="flex grow flex-col overflow-hidden" data-chat-list-wrapper>
      <div className="flex gap-1.5 px-3 pt-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          unstyled
          className={clsx(
            cardSkin === "shadow" ? "dark:bg-dark-900" : "dark:bg-dark-750",
            "h-8 rounded-md bg-gray-150 px-2 text-xs-plus ring-primary-500/50 placeholder:text-gray-400 focus:ring-3 dark:placeholder:text-dark-200/70",
          )}
          placeholder="Search here..."
          prefix={<MagnifyingGlassIcon className="size-4" />}
          data-chat-item
          onKeyDown={createScopedKeydownHandler({
            siblingSelector: "[data-chat-item]",
            parentSelector: "[data-chat-list-wrapper]",
            activateOnFocus: false,
            loop: false,
            orientation: "vertical",
          })}
        />
        <Button variant="flat" isIcon className="size-8 ltr:-mr-2 rtl:-ml-2">
          <PiSlidersHorizontal className="size-5" />
        </Button>
      </div>

      <ScrollShadow
        size={6}
        className="hide-scrollbar mt-3 flex grow flex-col overflow-y-auto"
      >
        {filteredChats.map((chat) => (
          <Button
            key={chat.id}
            variant={currentChat?.id === chat.id ? "filled" : "flat"}
            color={currentChat?.id === chat.id ? "primary" : "neutral"}
            className="justify-start gap-2.5 rounded-none px-3 py-2.5"
            onClick={() => setCurrentChat(chat.id)}
            onKeyDown={createScopedKeydownHandler({
              siblingSelector: "[data-chat-item]",
              parentSelector: "[data-chat-list-wrapper]",
              activateOnFocus: false,
              loop: false,
              orientation: "vertical",
            })}
            data-chat-item
          >
            <Avatar
              size={10}
              src={chat.profile.avatar}
              name={chat.profile.name}
              initialColor="auto"
              indicator={
                chat.isOnline ? (
                  <AvatarDot
                    isPing={chat.isImportant}
                    color={chat.isMuted ? "neutral" : "primary"}
                    className="right-0"
                  />
                ) : undefined
              }
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-baseline justify-between gap-1.5">
                <p
                  className={clsx(
                    currentChat?.id === chat.id
                      ? "text-white"
                      : "text-gray-800 dark:text-dark-100",
                    "truncate text-xs-plus font-medium",
                  )}
                >
                  <Highlight query={query}>{chat.profile.name}</Highlight>
                </p>
                <span
                  className={clsx(
                    currentChat?.id === chat.id
                      ? "text-white/90"
                      : "text-gray-400 dark:text-dark-300",
                    "shrink-0 text-tiny-plus",
                  )}
                >
                  {formatDate(dayjs(chat.lastMessage.createdAt))}
                </span>
              </div>
              <div className="mt-1 flex min-w-0 justify-between gap-1">
                <p
                  className={clsx(
                    currentChat?.id === chat.id
                      ? "text-white/90"
                      : "text-gray-400 dark:text-dark-300",
                    "truncate text-xs-plus font-light tracking-normal",
                  )}
                >
                  {chat.lastMessage.content}
                </p>
                {chat.unreadCount > 0 && (
                  <Badge
                    color={chat.isMuted ? "neutral" : "primary"}
                    className="h-4.5 min-w-[1.125rem] items-center justify-center rounded-full px-1.5 text-tiny-plus"
                  >
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </Button>
        ))}
      </ScrollShadow>
    </div>
  );
}
