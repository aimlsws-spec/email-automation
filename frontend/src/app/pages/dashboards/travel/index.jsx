// Local Imports
import { Page } from "components/shared/Page";
import { ToursTable } from "./ToursTable";
import { Analytics } from "./Analytics";
import { Expense } from "./Expense";
import { Calendar } from "./Calendar";
import { TopHotels } from "./TopHotels";

// ----------------------------------------------------------------------

export default function Travel() {
  return (
    <Page title="Travel Dashboard">
      <div className="mt-4 pb-8 sm:mt-5 lg:mt-6">
        <div className="transition-content grid grid-cols-12 gap-4 px-(--margin-x) sm:gap-5 lg:gap-6">
          <div className="card col-span-12 lg:col-span-8 xl:col-span-9">
            <ToursTable />
          </div>
          <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-4 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-3">
            <Analytics />
            <Expense />
            <Calendar />
          </div>
        </div>
        <TopHotels />
      </div>
    </Page>
  );
}
