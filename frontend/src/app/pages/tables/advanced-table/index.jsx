// Local Imports
import { Page } from "components/shared/Page";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { TeacherCoursesTable } from "./TeacherCoursesTable";
import { CryptoActivityTable } from "./CryptoActivityTable";
import { HRTable } from "./HRTable";
import { MediaTable } from "./MediaTable";
import { NFTTable } from "./NFTTable";
import { ProductsTable } from "./ProductsTable";
import { ProjectsTable } from "./ProjectsTable";
import { SubscriptionTable } from "./SubscriptionTable";
import { ToursTable } from "./ToursTable";
import { UsersTable } from "./UsersTable";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Tables", path: "/tables" },
  { title: "Advanced Table" },
];

export default function AdvancedTable() {
  return (
    <Page title="Advanced Table">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 ">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            Advanced Tables
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
          <HRTable />
          <ProductsTable />
          <ToursTable />
          <UsersTable />
          <SubscriptionTable />
          <MediaTable />
          <CryptoActivityTable />
          <NFTTable />
          <ProjectsTable />
          <TeacherCoursesTable />
        </div>
      </div>
    </Page>
  );
}
