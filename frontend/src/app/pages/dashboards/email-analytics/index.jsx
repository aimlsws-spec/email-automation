import SalesDashboard from "app/pages/dashboards/sales";
import { FollowUpPanel } from "components/followup/FollowUpPanel";

export default function EmailAnalytics() {
  return (
    <>
      <SalesDashboard />
      <div className="transition-content px-(--margin-x) pb-8">
        <h3 className="mb-5 text-base font-semibold text-gray-700 dark:text-dark-200">
          Follow-Up Sequence
        </h3>
        <FollowUpPanel />
      </div>
    </>
  );
}
