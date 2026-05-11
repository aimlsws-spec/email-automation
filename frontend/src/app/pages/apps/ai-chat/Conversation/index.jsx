// Import Dependencies
import { useEffect } from "react";

// Local Imports
import { ScrollShadow } from "components/ui";
import { Message } from "./Message";
import { useChatContext } from "../Chat.context";
import { Placeholder } from "./Placeholder";

// ----------------------------------------------------------------------

export function Conversation() {
  const { currentChat } = useChatContext();

  useEffect(() => {
    const scroll = document.querySelector("[data-conversation-panel]");
    scroll?.scrollTo({
      top: scroll.scrollHeight,
    });
  }, [currentChat?.id, currentChat?.messages?.length]);

  if (!(currentChat && currentChat.messages.length > 0)) return <Placeholder />;

  return (
    <ScrollShadow
      data-conversation-panel
      className="mx-auto flex w-full max-w-4xl grow flex-col space-y-8 overflow-y-auto px-4 py-4"
    >
      {currentChat.messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </ScrollShadow>
  );
}
