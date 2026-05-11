// Local Imports
import { Page } from "components/shared/Page";
import { TrendingItems } from "./TrendingItems";
import { NftTable } from "./NftTable";
import { Balance } from "./Balance";
import { TopArtists } from "./TopArtists";
import { FeaturedArtists } from "./FeaturedArtists";

// ----------------------------------------------------------------------

export default function Nftv1() {
  return (
    <Page title="NFT App v1">
      <div className="transition-content grid grid-cols-12 place-content-start gap-4 px-(--margin-x) pb-8 sm:gap-5 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <TrendingItems />
          <NftTable />
        </div>
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:mt-6 lg:space-y-6 xl:col-span-3">
          <Balance />
          <TopArtists />
          <FeaturedArtists />
        </div>
      </div>
    </Page>
  );
}
