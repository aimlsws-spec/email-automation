// Import Dependencies
import clsx from "clsx";

// Local Imports
import { useChatContext } from "../Chat.context";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Messages } from "./Messages";
import { Placeholder } from "./Placeholder";

// ----------------------------------------------------------------------

export function ConversationPanel() {
  const { currentChat, showProfile } = useChatContext();

  if (!currentChat) return <Placeholder />;

  return (
    <main
      className={clsx(
        showProfile && "md:ltr:mr-80 md:rtl:ml-80",
        "chat-app main-content transition-content flex h-screen min-w-0 flex-col supports-[height:1dvh]:h-dvh",
      )}
    >
      <Header />
      <Messages />
      <Footer />
    </main>
  );
}
