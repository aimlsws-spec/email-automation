// Local Imports
import { Page } from "components/shared/Page";
import { CandlestickChart } from "./CandlestickChart";
import { Statistics } from "./Statistics";
import { Balance } from "./Balance";
import { Exchange } from "./Exchange";
import { Mining } from "./Mining";

// ----------------------------------------------------------------------

export default function Crypto2() {
  return (
    <Page title="Cryptocurrency Dashboard V2">
      <div className="transition-content mt-5 grid grid-cols-12 gap-4 px-(--margin-x) pb-8 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            <CandlestickChart />
            <Statistics />
            <Mining />
          </div>
        </div>
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
          <Balance />
          <Exchange />
        </div>
      </div>
    </Page>
  );
}
