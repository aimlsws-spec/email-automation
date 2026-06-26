// Local Imports
import { Page } from "components/shared/Page";
import { Overview } from "./Statistics/Overview";
import { QueueOverview } from "./Statistics/QueueOverview";
import { SalesReport } from "./Statistics/SalesReport";
import { SendInitialEmailCard } from "./SendInitialEmailCard";
import { RecentActivity } from "./RecentActivity";
import { FollowUpOverview } from "./FollowUpOverview";
import { CampaignsTable } from "./CampaignsTable";
import { ActivityPanel } from "./ActivityPanel";
// ----------------------------------------------------------------------

export default function Sales() {
  return (
    <Page title="Email Workflow Dashboard">
      <div className="transition-content overflow-hidden px-(--margin-x) pb-8">
        <div className="mt-6">
          <Overview />
        </div>

        {/* QUEUE STATUS ROW */}
        <div className="mt-6">
          <QueueOverview />
        </div>

        {/* THIRD ROW: Email Activity Chart */}
        <div className="mt-6">
          <SalesReport />
        </div>

        {/* FOURTH ROW: Campaign Tracking Table */}
        <div className="mt-6">
          <CampaignsTable />
        </div>

        {/* BOTTOM: Insights & Outreach */}
        <div className="mt-6 grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          <div className="col-span-12 lg:col-span-4">
            <SendInitialEmailCard />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <RecentActivity />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <FollowUpOverview />
          </div>
        </div>

        {/* ACTIVITY (LINK CLICKS + UNSUBSCRIBES) ROW */}
        <div className="mt-6">
          <ActivityPanel />
        </div>
      </div>
    </Page>
  );
}
