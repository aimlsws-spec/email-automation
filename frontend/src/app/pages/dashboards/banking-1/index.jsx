// Local Imports
import { Page } from "components/shared/Page";
import { Statistics } from "./Statistics";
import { Transactions } from "./Transactions";
import { History } from "./History";
import { SendFlow } from "./SendFlow";

// ----------------------------------------------------------------------

export default function Banking1() {
  return (
    <Page title="Banking Dashboard V1">
      <div className="transition-content mt-5 grid w-full grid-cols-12 gap-4 overflow-hidden px-(--margin-x) pb-8 sm:gap-5 lg:mt-6 lg:gap-6">
        <SendFlow />
        <div className="col-span-12 lg:col-span-8">
          <Statistics />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:mt-6 lg:gap-6">
            <Transactions />
            <History />
          </div>
        </div>
      </div>
    </Page>
  );
}
