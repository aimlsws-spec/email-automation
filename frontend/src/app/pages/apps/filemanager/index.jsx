// Local Imports
import { Page } from "components/shared/Page";
import { Header as MainHeader } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { RecentFolders } from "./RecentFolders";
import { FoldersTable } from "./FoldersTable";
import { Tags } from "./Tags";

// ----------------------------------------------------------------------

export default function FileManager() {
  return (
    <Page title="File Manager App">
      <MainHeader />
      <main className="main-content transition-content grid grid-cols-1 place-content-start pb-6 pt-5">
        <Header />
        <RecentFolders />
        <div className="transition-content mt-4 grid grid-cols-12 gap-4 px-(--margin-x) sm:mt-5 sm:gap-5 lg:gap-6">
          <FoldersTable />
          <Tags />
        </div>
      </main>
      <Sidebar />
    </Page>
  );
}
