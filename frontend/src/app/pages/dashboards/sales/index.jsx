// Local Imports
import { Page } from "components/shared/Page";
import { Overview } from "./Statistics/Overview";
import { SalesReport } from "./Statistics/SalesReport";
import { TopCampaignCard } from "./Statistics/TopCampaignCard";
import { Rating } from "./Statistics/Rating";
import { CompletedOrders } from "./Statistics/CompletedOrders";
import { SendInitialEmailCard } from "./SendInitialEmailCard";
import { RecentActivity } from "./RecentActivity";
import { AutomationOverview } from "./AutomationOverview";
import { FollowUpOverview } from "./FollowUpOverview";
import { CampaignsTable } from "./CampaignsTable";
import { LiveCampaignProgress } from "./LiveCampaignProgress";
import { LinkActivity } from "./LinkActivity";
import { DomainReputation } from "./DomainReputation";
// ----------------------------------------------------------------------

export default function Sales() {
  return (
    <Page title="Email Workflow Dashboard">
      <div className="transition-content overflow-hidden px-(--margin-x) pb-8">
        {/* TOP: Live Progress */}
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <LiveCampaignProgress />
        </div>

        {/* SECOND ROW: 4 Metric Cards */}
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <Overview />
        </div>

        {/* THIRD ROW: Chart (70%) and Top Campaign/Rates (30%) */}
        <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          <div className="col-span-12 lg:col-span-8">
            <SalesReport />
          </div>
          <div className="col-span-12 flex flex-col gap-4 sm:gap-5 lg:col-span-4 lg:gap-6">
            <TopCampaignCard />
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              <Rating />
              <CompletedOrders />
            </div>
          </div>
        </div>

        {/* FOURTH ROW: Campaign Tracking Table */}
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <CampaignsTable />
        </div>

        {/* BOTTOM: Insights & Outreach */}
        <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          <div className="col-span-12 lg:col-span-3">
            <SendInitialEmailCard />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <RecentActivity />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <FollowUpOverview />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <AutomationOverview />
          </div>
        </div>

        {/* LINK ACTIVITY ROW */}
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <LinkActivity />
        </div>

        {/* DOMAIN REPUTATION ROW */}
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <DomainReputation />
        </div>
      </div>
    </Page>
  );
}
