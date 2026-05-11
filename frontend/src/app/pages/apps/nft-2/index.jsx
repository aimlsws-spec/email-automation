// Local Imports
import { Page } from "components/shared/Page";
import { FeaturedArtists } from "./FeaturedArtists";
import { Feeds } from "./Feeds";
import { CreditCard } from "./CreditCard";
import { FeaturedItem } from "./FeaturedItem";
import { History } from "./History";

// ----------------------------------------------------------------------

export default function Nftv2() {
  return (
    <Page title="NFT App v2">
      <div className="transition-content mt-5 grid grid-cols-12 place-content-start gap-4 px-(--margin-x) pb-8 sm:gap-5 lg:gap-6">
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-8 lg:space-y-6 xl:col-span-9">
          <FeaturedArtists />
          <Feeds />
        </div>
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6 xl:col-span-3">
          <CreditCard />
          <FeaturedItem />
          <History />
        </div>
      </div>
    </Page>
  );
}
