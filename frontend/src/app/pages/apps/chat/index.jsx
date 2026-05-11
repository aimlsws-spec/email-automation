// Local Imports
import { Page } from "components/shared/Page";
import { ChatProvider } from "./ChatProvider";
import { Sidebar } from "./Sidebar";
import { ConversationPanel } from "./ConversationPanel";
import { ProfileInfo } from "./ProfileInfo";

// ----------------------------------------------------------------------

export default function Chat() {
  return (
    <Page title="Chat">
      <ChatProvider>
        <Sidebar />
        <ConversationPanel />
        <ProfileInfo />
      </ChatProvider>
    </Page>
  );
}
