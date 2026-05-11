// Local Imports
import { Page } from "components/shared/Page";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Conversation } from "./Conversation";
import { ChatProvider } from "./ChatProvider";
import { Footer } from "./Footer";

// ----------------------------------------------------------------------

export default function AiChat() {
  return (
    <Page title="Ai Chat">
      <ChatProvider>
        <Sidebar />
        <main className="main-content transition-content flex h-screen min-w-0 flex-col supports-[height:1dvh]:h-dvh">
          <Header />
          <Conversation />
          <Footer />
        </main>
      </ChatProvider>
    </Page>
  );
}
