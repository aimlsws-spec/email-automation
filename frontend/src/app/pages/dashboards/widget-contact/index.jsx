// Local Imports
import { Page } from "components/shared/Page";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { Calling } from "./Calling";
import { Speaking } from "./Speaknig";
import { ContactList } from "./ContactList";
import { ContactInfo } from "./ContactInfo";
import { CallSetting } from "./CallSetting";
import { ModuleToggle } from "./ModuleToggle";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Dashboards", path: "/dashboards" },
  { title: "Widget Contacts" },
];

export default function WidgetContacts() {
  return (
    <Page title="Widget Contacts">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="flex items-center space-x-4 py-5  lg:py-6">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            Widget Contacts
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <Calling />
            <Speaking />
          </div>
          <ContactList />
          <ContactInfo />
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <CallSetting />
            <ModuleToggle />
          </div>
        </div>
      </div>
    </Page>
  );
}
