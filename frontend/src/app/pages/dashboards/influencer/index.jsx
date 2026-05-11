// Local Imports
import { Page } from "components/shared/Page";
import { Statistics } from "./Statistics";
import { Activity } from "./Activity";
import { Performers } from "./Performers";
import { Channels } from "./Channels";

// ----------------------------------------------------------------------

export default function Influencer() {
  return (
    <Page title="Influencer Dashboard">
      <div className="transition-content mt-4 px-(--margin-x) pb-8 sm:mt-5 lg:mt-6">
        <div className="grid grid-cols-1 place-content-start gap-4 sm:gap-5 lg:gap-6">
          <Statistics />
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
            <Activity />
            <Performers />
          </div>
          <Channels />
        </div>
      </div>
    </Page>
  );
}
