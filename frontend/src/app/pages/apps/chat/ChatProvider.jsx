// Import Dependencies
import PropTypes from "prop-types";
import { useState } from "react";

// Local Imports
import { ChatContextProvider } from "./Chat.context";
import { fakeChats } from "./data";
import { randomId } from "utils/randomId";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";

// ----------------------------------------------------------------------

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(fakeChats);
  const [activeChatId, setActiveChatId] = useState(null);
  const { lgAndUp } = useBreakpointsContext();
  const [showProfile, setShowProfile] = useState(lgAndUp);

  const currentChat = chats.find((chat) => chat.id === activeChatId);

  const newMessage = (chatId, data) => {
    const now = new Date();
    const chat = chats.find((chat) => chat.id === chatId);

    chat.messages.push({
      id: randomId(),
      content: data.content,
      createdAt: now,
      isMe: true,
    });

    chat.lastMessage = {
      content: data.content,
      createdAt: now,
    };

    chat.unreadCount = 0;
    chats.splice(chats.indexOf(chat), 1);
    setChats([chat, ...chats]);
  };

  const value = {
    chats,
    currentChat,
    newMessage,
    setActiveChatId,
    showProfile: showProfile && !!activeChatId,
    setShowProfile,
  };

  return <ChatContextProvider value={value}>{children}</ChatContextProvider>;
}

ChatProvider.propTypes = {
  children: PropTypes.node,
};
