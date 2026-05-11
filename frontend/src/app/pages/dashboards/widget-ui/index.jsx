// Local Imports
import { Page } from "components/shared/Page";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { Labels } from "./Labels";
import { InstagramPost } from "./InstagramPost";
import { TwitterPost } from "./TwitterPost";
import { Search } from "./Search";
import { Contact } from "./Contact";
import { Gallery } from "./Gallery";
import { Message } from "./Message";
import { Walking } from "./Walking";
import { Time } from "./Time";
import { MayYouKnow } from "./MayYouKnow";
import { HappyBirthday } from "./HappyBirthday";
import { Share } from "./Share";
import { Colors } from "./Colors";
import { Statistic } from "./Statistic";
import { Technologies } from "./Technologies";
import { DailyVisits } from "./DailyVisits";
import { NewUsers } from "./NewUsers";
import { NewProduct } from "./NewProducts";
import { PrimaryCard } from "./PrimaryCard";
import { Conference } from "./Conference";
import { NewFollowers } from "./NewFollowers";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Dashboards", path: "/dashboards" },
  { title: "Widget UI" },
];

export default function WidgetUI() {
  return (
    <Page title="Widget UI">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="flex items-center space-x-4 py-5  lg:py-6">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            Widget UI
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <Labels />
            <InstagramPost />
            <TwitterPost />
            <Search />
            <Contact />
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <Gallery />
            <Message />
            <div className="flex gap-4 sm:gap-5 lg:gap-6">
              <Walking />
              <Time />
            </div>
            <MayYouKnow />
            <HappyBirthday />
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <Share />
            <Colors />
            <Statistic />
            <Technologies />
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <DailyVisits />
            <NewUsers />
            <NewProduct />
            <PrimaryCard />
            <Conference />
            <NewFollowers />
          </div>
        </div>
      </div>
    </Page>
  );
}
