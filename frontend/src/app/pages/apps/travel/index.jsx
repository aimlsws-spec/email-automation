// Local Imports
import { Page } from "components/shared/Page";
import { Tours } from "./Tours";
import { TopHotels } from "./TopHotels";
import { MyPlan } from "./MyPlan";
import { Calendar } from "./Calendar";

// ----------------------------------------------------------------------

export default function Travel() {
  return (
    <Page title="Travel App">
      <div className="transition-content px-(--margin-x) pb-8">
        <div className="flex items-center justify-between gap-2 py-5">
          <h3 className="text-xl font-medium text-gray-800 dark:text-dark-50 lg:text-2xl">
            Travel
          </h3>

          <div>
            <a
              href="##"
              className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
            >
              Explore the world
            </a>
          </div>
        </div>
        <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
          <Tours />
          <div className="col-span-12 lg:col-span-4">
            <TopHotels />
            <MyPlan />
            <Calendar />
          </div>
        </div>
      </div>
    </Page>
  );
}
