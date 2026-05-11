// Local Imports
import { Page } from "components/shared/Page";
import { PageViews } from "./PageViews";
import { Visitors } from "./Tops/Visitors";
import { Comments } from "./Tops/Comments";
import { Searchs } from "./Tops/Searchs";
import { FeaturedAuthors } from "./FeaturedAuthors";

// ----------------------------------------------------------------------

export default function CMSAnalytics() {
  return (
    <Page title="CMS Analytics Dashboard">
      <div className="mt-5 pb-8 lg:mt-6">
        <div className="transition-content px-(--margin-x)">
          <PageViews />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:grid-cols-3 lg:gap-6">
            <Visitors />
            <Comments />
            <Searchs />
          </div>
        </div>
        <FeaturedAuthors />
      </div>
    </Page>
  );
}
