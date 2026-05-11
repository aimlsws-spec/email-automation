// Local Imports
import { Page } from "components/shared/Page";
import { Welcome } from "./Welcome";
import { WorkingHours } from "./WorkingHours";
import { Students } from "./Students";
import { Calendar } from "./Calendar";
import { MediaTable } from "./MediaTable";
import { Classes } from "./Classes";

// ----------------------------------------------------------------------

export default function Teacher() {
  return (
    <Page title="Teacher Dashboard">
      <div className="transition-content mt-4 grid w-full grid-cols-12 gap-4 px-(--margin-x) pb-8 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <Welcome />
          <Classes />
          <MediaTable />
        </div>
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:sticky lg:top-20 lg:col-span-4 lg:grid-cols-1 lg:gap-6 lg:self-start xl:col-span-3">
          <WorkingHours />
          <Students />
          <Calendar />
        </div>
      </div>
    </Page>
  );
}
