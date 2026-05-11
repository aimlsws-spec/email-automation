// Local Imports
import { Page } from "components/shared/Page";
import { Overview } from "./Overview";
import { Statistics } from "./Statistics";
import { Projects } from "./Projects";
import { CustomerSatisfaction } from "./CustomerSatisfaction";
import { TopSellers } from "./TopSellers";
import { UsersActivity } from "./UsersActivity";
import { BandwidthReport } from "./BandwidthReport";

// ----------------------------------------------------------------------

export default function CRMAnalytics() {
  return (
    <Page title="CRM Analytics Dashboard">
      <div className="pb-8 overflow-hidden">
        <div className="transition-content mt-4 grid grid-cols-12 gap-4 px-(--margin-x) sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          <Overview />
          <Statistics />
          <Projects />
          <CustomerSatisfaction />
        </div>
        <TopSellers />
        <div className="transition-content mt-4 grid grid-cols-1 gap-4 px-(--margin-x) sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:mt-6 lg:gap-6">
          <BandwidthReport />
          <UsersActivity />
        </div>
      </div>
    </Page>
  );
}
