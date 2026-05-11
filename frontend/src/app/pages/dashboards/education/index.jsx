// Local Imports
import { Page } from "components/shared/Page";
import { MyCourses } from "./MyCourses";
import { Timeline } from "./Timeline";
import { Statistics } from "./Statistics";
import { Awards } from "./Awards";
import { GroupLessons } from "./GroupLessons";
import { CompletedCourses } from "./CompletedCourses";

// ----------------------------------------------------------------------

export default function Education() {
  return (
    <Page title="Education Dashboard">
      <div className="mt-5 pb-8">
        <MyCourses />
        <div className="transition-content mt-4 grid grid-cols-12 gap-4 px-(--margin-x) sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          <Timeline />
          <Statistics />
          <Awards />
          <GroupLessons />
          <CompletedCourses />
        </div>
      </div>
    </Page>
  );
}
