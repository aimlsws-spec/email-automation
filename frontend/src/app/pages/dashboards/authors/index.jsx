// Local Imports
import { Page } from "components/shared/Page";
import { Header } from "./Header";
import { Statistic } from "./Statistic";
import { Visitors } from "./Visitors";
import { Members } from "./Members";
import { LatestPosts } from "./LatestPosts";
import { TopAuthors } from "./TopAuthors";

// ----------------------------------------------------------------------

export default function Authors() {
  return (
    <Page title="Authors Dashboard">
      <div className="transition-content w-full px-(--margin-x)">
        <Header />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:mt-6 lg:grid-cols-4 lg:gap-6">
          <Statistic />
          <Visitors />
          <Members />
        </div>
      </div>
      <TopAuthors />
      <LatestPosts />
    </Page>
  );
}
