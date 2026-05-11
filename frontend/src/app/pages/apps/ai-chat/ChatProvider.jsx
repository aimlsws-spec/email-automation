// Import Dependencies
import PropTypes from "prop-types";
import { useState } from "react";

// Local Imports
import { ChatContextProvider } from "./Chat.context";
import { fakeChats } from "./data";
import { randomId } from "utils/randomId";

// ----------------------------------------------------------------------

const answerPromise = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          answer:
            "I bring information to your fingertips, answer your questions with clarity, and keep conversations interesting. I can handle a wide range of topics, from factual inquiries to creative writing.",
        }),
      1000,
    ),
  );

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(fakeChats);
  const [activeChatId, setActiveChatId] = useState(null);

  const currentChat = chats.find((chat) => chat.id === activeChatId);

  const getQuestion = async (chatId, messageId) => {
    try {
      const response = await answerPromise();
      setChats((prevChats) => {
        const updatedChats = prevChats.slice();
        const chatIndex = updatedChats.findIndex((chat) => chat.id === chatId);

        updatedChats[chatIndex].messages.find(
          (message) => message.id === messageId,
        ).a = response.answer;

        return updatedChats;
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const newMessage = (chatId, data) => {
    const now = new Date();
    const messageId = randomId();
    const updatedChats = chats.slice();

    const chatIndex = updatedChats.findIndex((chat) => chat.id === chatId);
    const currentChatId = chatIndex === -1 ? randomId() : chatId;

    if (chatIndex === -1) {
      const newChat = {
        id: currentChatId,
        messages: [
          {
            id: messageId,
            q: data.content,
            a: "",
            createdAt: now,
          },
        ],
        createdAt: now,
      };
      updatedChats.unshift(newChat);
      setActiveChatId(currentChatId);
      setChats([...updatedChats]);
    } else {
      const updatedChat = updatedChats[chatIndex];
      updatedChat.messages.push({
        id: messageId,
        q: data.content,
        a: "",
        createdAt: now,
      });
      updatedChats.splice(chatIndex, 1);
      setChats([updatedChat, ...updatedChats]);
    }

    getQuestion(currentChatId, messageId);
  };

  const value = {
    chats,
    currentChat,
    newMessage,
    setActiveChatId,
  };

  return <ChatContextProvider value={value}>{children}</ChatContextProvider>;
}

ChatProvider.propTypes = {
  children: PropTypes.node,
};
