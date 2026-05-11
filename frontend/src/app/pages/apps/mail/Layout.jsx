// Import Dependencies
import { Outlet } from "react-router";

// Local Imports
import { Page } from "components/shared/Page";
import { Header as MainHeader } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";

// ----------------------------------------------------------------------

export default function Layout() {
  return (
    <Page title="Mail App">
      <MainHeader />
      <main className="main-content transition-content grid flex-1 grid-cols-1 place-content-start px-(--margin-x) pb-5">
        <Outlet />
      </main>
      <Sidebar />
    </Page>
  );
}
