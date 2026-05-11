// Local Imports
import { Page } from "components/shared/Page";
import { Statistics } from "./Statistics";
import { OngoingProjects } from "./OngoingProjects";
import { ContactList } from "./ContactList";
import { RecentPayments } from "./RecentPayments";
import { ClientMessages } from "./ClientMessages";
import { Calendar } from "./Calendar";
import { Tweets } from "./Tweets";
import { Income } from "./Income";

// ----------------------------------------------------------------------

export default function Personal() {
  return (
    <Page title="Personal Dashboard">
      <div className="transition-content px-(--margin-x) pb-8 mt-5 lg:mt-6">
        <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-8 lg:space-y-6">
            <Statistics />
            <OngoingProjects />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
              <ContactList />
              <RecentPayments />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:gap-6">
              <ClientMessages />
              <Income />
              <Calendar />
              <Tweets />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
