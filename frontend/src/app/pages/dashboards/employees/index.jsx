// Local Imports
import { Page } from "components/shared/Page";
import { ClientGrowth } from "./ClientGrowth";
import { SalesGrowth } from "./SalesGrowth";
import { Tasks } from "./Tasks";
import { EmployeeList } from "./EmployeeList";

// ----------------------------------------------------------------------

export default function Employees() {
  return (
    <Page title="Employees">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-3 sm:gap-5 lg:mt-6 lg:gap-6">
          <ClientGrowth />
          <SalesGrowth />
          <Tasks />
        </div>
        <EmployeeList />
      </div>
    </Page>
  );
}
