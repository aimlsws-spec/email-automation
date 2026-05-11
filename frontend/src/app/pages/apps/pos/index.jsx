// Local Imports
import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "./Sidebar";
import { Categories } from "./Categories";
import { Products } from "./Products";
import { Basket } from "./Basket";

// ----------------------------------------------------------------------

export default function Pos() {
  return (
    <Page title="Point of Sales App">
      <Header />
      <main className="main-content transition-content grid grid-cols-12 gap-4 px-(--margin-x) pb-6 pt-5 sm:gap-5 lg:gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-8">
          <Categories />
          <Products />
        </div>
        <div className="max-sm:block sm:sticky sm:top-20 sm:col-span-6 sm:self-start lg:col-span-4">
          <Basket />
        </div>
      </main>
      <Sidebar />
    </Page>
  );
}
