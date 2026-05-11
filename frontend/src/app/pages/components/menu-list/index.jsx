// Local Imports
import { Page } from "components/shared/Page";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { MenuExample1 } from "./MenuExample1";
import { MenuExample2 } from "./MenuExample2";
import { MenuExample3 } from "./MenuExample3";
import { MenuExample4 } from "./MenuExample4";
import { MenuExample5 } from "./MenuExample5";
import { MenuExample6 } from "./MenuExample6";
import { MenuExample7 } from "./MenuExample7";
import { MenuExample8 } from "./MenuExample8";
import { MenuExample9 } from "./MenuExample9";
import { MenuExample10 } from "./MenuExample10";
import { MenuExample11 } from "./MenuExample11";
import { MenuExample12 } from "./MenuExample12";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/menu-list" },
  { title: "Menu List" },
];

const MenuList = () => {
  return (
    <Page title="Menu List">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="flex items-center space-x-4 py-5  lg:py-6">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            Menu List
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <MenuExample1 />
            <MenuExample2 />
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <MenuExample3 />
            <MenuExample4 />
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <MenuExample5 />
            <MenuExample6 />
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <MenuExample7 />
            <MenuExample8 />
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <MenuExample9 />
            <MenuExample10 />
          </div>
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <MenuExample11 />
            <MenuExample12 />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default MenuList;
