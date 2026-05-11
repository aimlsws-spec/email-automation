// Local Imports
import { CompletedOrders } from "./CompletedOrders";
import { TopCampaignCard } from "./TopCampaignCard";
import { Orders } from "./Orders";
import { Overview } from "./Overview";
import { Rating } from "./Rating";
import { SalesReport } from "./SalesReport";

// ----------------------------------------------------------------------

export function Statistics() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 lg:mt-6 lg:gap-6">
      <Overview />
      <div className="order-first grid grid-cols-12 gap-4 sm:order-none sm:gap-5 lg:gap-6">
        <SalesReport />
        <div className="col-span-12 order-first grid grid-cols-2 gap-4 sm:order-last sm:col-span-6 sm:gap-5 lg:col-span-5 lg:gap-6 xl:col-span-4">
          <TopCampaignCard />
          <Rating />
          <Orders />
          <CompletedOrders />
        </div>
      </div>
    </div>
  );
}
