// Local Imports
import OrdersTable from "./OrdersTable";
import { Page } from "components/shared/Page";
import { Overview } from "./Overview";
import { Budget } from "./Budget";
import { Income } from "./Income";
import { Expense } from "./Expense";
import { TopSellers } from "./TopSellers";
import { SocialTraffic } from "./SocialTraffic";
import { TopCountries } from "./TopCountries";

// ----------------------------------------------------------------------

export default function Orders() {
  return (
    <Page title="Orders Dashboard">
      <div className="transition-content mt-5 px-(--margin-x) pb-8 lg:mt-6">
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          <Overview />
          <div className="col-span-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 lg:col-span-4 lg:grid-cols-2 lg:gap-6">
            <Budget />
            <Income />
            <Expense />
          </div>
          <TopSellers />
          <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-7 lg:gap-6 xl:col-span-6">
            <SocialTraffic />
            <TopCountries />
          </div>
          <OrdersTable />
        </div>
      </div>
    </Page>
  );
}
