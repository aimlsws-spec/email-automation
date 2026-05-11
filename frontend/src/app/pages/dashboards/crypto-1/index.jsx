// Local Imports
import { Page } from "components/shared/Page";
import { Balance } from "./Balance";
import { ActivitiesTable } from "./ActivitiesTable";
import { Watchlist } from "./Watchlist";
import { Wallets } from "./Wallets";
import { Exchange } from "./Exchange";
import { TransactionsChart } from "./TransactionsChart";

// ----------------------------------------------------------------------

export default function Crypto1() {
  return (
    <Page title="Cryptocurrency Dashboard V1">
      <div className="transition-content mt-5 grid grid-cols-12 gap-4 px-(--margin-x) pb-8 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-8 lg:space-y-6">
          <Balance />
          <Watchlist />
          <ActivitiesTable />
        </div>
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
          <Wallets />
          <Exchange />
          <TransactionsChart />
        </div>
      </div>
    </Page>
  );
}
