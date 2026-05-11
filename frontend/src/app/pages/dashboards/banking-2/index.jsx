// Local Imports
import { Page } from "components/shared/Page";
import { Balance } from "./Balance";
import { History } from "./History";
import { SendFlow } from "./SendFlow";

// ----------------------------------------------------------------------

export default function Banking2() {
  return (
    <Page title="Banking Dashboard V2">
      <div className="transition-content mt-5 grid grid-cols-12 place-content-start gap-4 px-(--margin-x) pb-8 sm:gap-5 lg:mt-6 lg:gap-6">
        <Balance />
        <History />
        <SendFlow />
      </div>
    </Page>
  );
}
