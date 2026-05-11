// Local Imports
import { Page } from "components/shared/Page";
import { Header as MainHeader } from "app/layouts/MainLayout/Header";
import { TodoProvider } from "./TodoProvider";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Todos } from "./Todos";

// ----------------------------------------------------------------------

export default function Todo() {
  return (
    <Page title="Todo">
      <TodoProvider>
        <MainHeader />
        <main className="main-content transition-content grid grid-cols-1 place-content-start px-(--margin-x) pb-6 pt-5">
          <Header />
          <Todos />
        </main>
        <Sidebar />
      </TodoProvider>
    </Page>
  );
}
