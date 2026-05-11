// Local Imports
import { Page } from "components/shared/Page";
import { Header as MainHeader } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BoardProvider } from "./BoardProvider";
import { Board } from "./Board";

// ----------------------------------------------------------------------

export default function Kanban() {
  return (
    <Page title="Kanban Board">
      <div className="flex h-screen flex-col supports-[height:1dvh]:h-dvh">
        <MainHeader />
        <BoardProvider>
          <main className="main-content transition-content grid flex-1 grid-cols-1">
            <Header />
            <Board />
          </main>
          <Sidebar />
        </BoardProvider>
      </div>
    </Page>
  );
}
