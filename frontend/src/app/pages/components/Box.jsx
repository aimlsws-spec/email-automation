// Local Imports
import { Box } from "components/ui";
import { Page } from "components/shared/Page";
import { Breadcrumbs } from "components/shared/Breadcrumbs";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Box" },
];

const Boxes = () => {
  return (
    <Page title="Box">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 ">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            Box
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {/* Simple Box */}
          <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                Simple Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Rounded Box */}
          <Box className="rounded-2xl bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                Rounded Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Bordered Box */}
          <Box className="rounded-lg border border-gray-150 bg-white px-4 py-4 dark:border-dark-600 dark:bg-dark-700 sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                Bordered Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Primary Box */}
          <Box className="rounded-lg bg-primary-600 px-4 py-4 text-white dark:bg-primary-500 sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Primary Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Secondary Box */}
          <Box className="rounded-lg bg-secondary px-4 py-4 text-white sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Secondary Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Info Box */}
          <Box className="rounded-lg bg-info px-4 py-4 text-white sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Info Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Success Box */}
          <Box className="rounded-lg bg-success px-4 py-4 text-white sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Success Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Warning Box */}
          <Box className="rounded-lg bg-warning px-4 py-4 text-white sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Warning Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Error Box */}
          <Box className="rounded-lg bg-error px-4 py-4 text-white sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Error Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Glow Primary Box */}
          <Box className="rounded-lg bg-primary-600 px-4 py-4 text-white shadow-lg shadow-primary-600/50 dark:bg-primary-500 dark:shadow-primary-500/50 sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Primary Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Glow Warning Box */}
          <Box className="rounded-lg bg-warning px-4 py-4 text-white shadow-lg shadow-warning/50 sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Primary Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Glow Info Box */}
          <Box className="rounded-lg bg-info px-4 py-4 text-white shadow-lg shadow-info/50 sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Primary Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Gradient Box */}
          <Box className="rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 px-4 py-4 text-white  sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Gradient Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Gradient Box */}
          <Box className="rounded-lg bg-linear-to-r from-fuchsia-600 to-pink-600 px-4 py-4 text-white  sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Gradient Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Gradient Box */}
          <Box className="rounded-lg bg-linear-to-br from-amber-400 to-orange-600 px-4 py-4 text-white  sm:px-5">
            <div>
              <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                Gradient Box
              </h2>
            </div>
            <div className="pt-2">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                laboriosam praesentium adipisci iure doloribus accusamus animi
                quos.
              </p>
            </div>
          </Box>

          {/* Outlined Gradient Box */}
          <Box className="rounded-lg bg-linear-to-r from-sky-400 to-blue-600 p-1">
            <Box className="rounded-lg bg-gray-50 px-4 py-4 dark:bg-dark-900 sm:px-5">
              <div>
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                  Outlined Gradient
                </h2>
              </div>
              <div className="pt-2">
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                  laboriosam praesentium adipisci iure doloribus accusamus animi
                  quos.
                </p>
              </div>
            </Box>
          </Box>

          {/* Outlined Gradient Box */}
          <Box className="rounded-lg bg-linear-to-r from-green-400 to-fuchsia-400 p-1">
            <Box className="rounded-lg bg-gray-50 px-4 py-4 dark:bg-dark-900 sm:px-5">
              <div>
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                  Outlined Gradient
                </h2>
              </div>
              <div className="pt-2">
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                  laboriosam praesentium adipisci iure doloribus accusamus animi
                  quos.
                </p>
              </div>
            </Box>
          </Box>

          {/* Outlined Gradient Box */}
          <Box className="rounded-lg bg-linear-to-r from-amber-400 to-orange-600 p-1">
            <Box className="rounded-lg bg-gray-50 px-4 py-4 dark:bg-dark-900 sm:px-5">
              <div>
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide">
                  Outlined Gradient
                </h2>
              </div>
              <div className="pt-2">
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut
                  laboriosam praesentium adipisci iure doloribus accusamus animi
                  quos.
                </p>
              </div>
            </Box>
          </Box>
        </div>
      </div>
    </Page>
  );
};

export default Boxes;
