// Import Dependencies
import { Cog6ToothIcon, PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Page } from "components/shared/Page";
import { Avatar, Badge, Box, Button, Progress } from "components/ui";

// ----------------------------------------------------------------------

export default function ProjectsBoard() {
  return (
    <Page title="Projects Board">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="mt-6 flex flex-col items-center justify-between space-y-2 text-center sm:flex-row sm:space-y-0 sm:text-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              Projects Board
            </h3>
            <p className="mt-1 hidden sm:block">
              List of your ongoing projects
            </p>
          </div>
          <Button
            color="primary"
            isGlow
            className="h-10 space-x-2 whitespace-nowrap "
          >
            <PlusIcon className="size-4.5 shrink-0" />
            <span>New Project</span>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          <Box className="flex flex-col rounded-lg bg-white dark:bg-dark-700">
            <Box className="flex flex-1 flex-col justify-between rounded-lg bg-warning p-4 sm:p-5">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    className="size-12 rounded-lg object-cover object-center"
                    src="/images/technology/hand-write-laptop.jpg"
                    alt="cover"
                  />
                  <p className="text-xs-plus text-white/90">May 01, 2021</p>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-white">
                  Mobile App
                </h3>
                <p className="text-xs-plus text-white/90">Prototyping</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-xs-plus text-white">Progress</p>
                  <Progress
                    value={78}
                    unstyled
                    classNames={{
                      root: "my-2 h-1.5 bg-white/30",
                      bar: "bg-white",
                    }}
                  />
                  <p className="text-end text-xs-plus font-medium text-white">
                    78%
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap -space-x-2 ">
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-warning",
                    }}
                    src="/images/avatar/avatar-1.jpg"
                  />

                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-warning",
                    }}
                    name="John Doe"
                    initialColor="info"
                  />

                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-18.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-warning",
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge
                    unstyled
                    className="badge h-5.5 rounded-full bg-black/20 px-2 text-xs-plus text-white"
                  >
                    1 week left
                  </Badge>
                  <Button
                    isIcon
                    unstyled
                    className="size-8 rounded-full text-white hover:bg-white/20 focus:bg-white/20 active:bg-white/25 ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <Cog6ToothIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </Box>
          </Box>

          <Box className="flex flex-col rounded-lg bg-white dark:bg-dark-700">
            <Box className="this:info flex flex-1 flex-col justify-between rounded-lg bg-this/[.15] p-4 dark:bg-transparent sm:p-5">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    className="size-12 rounded-lg object-cover object-center"
                    src="/images/technology/design-sm.jpg"
                    alt="cover"
                  />
                  <p className="text-xs-plus">June 04, 2021</p>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
                  Design Learn Management System
                </h3>
                <p className="text-xs-plus">UI/UX Design</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-xs-plus text-gray-800 dark:text-dark-100">
                    Progress
                  </p>
                  <Progress
                    value={32}
                    color="info"
                    classNames={{
                      root: "my-2 h-1.5",
                    }}
                  />
                  <p className="text-end text-xs-plus font-medium text-this dark:text-this-lighter">
                    32%
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap -space-x-2 ">
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    src="/images/avatar/avatar-1.jpg"
                  />
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    name="John Doe"
                    initialColor="info"
                  />
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    src="/images/avatar/avatar-18.jpg"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge
                    color="info"
                    className="h-5.5 rounded-full px-2 text-xs-plus"
                  >
                    2 week left
                  </Badge>
                  <Button
                    isIcon
                    variant="flat"
                    className="size-8 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <Cog6ToothIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </Box>
          </Box>

          <Box className="flex flex-col rounded-lg bg-white dark:bg-dark-700">
            <Box className="this:secondary flex flex-1 flex-col justify-between rounded-lg bg-this/[.15] p-4 dark:bg-transparent sm:p-5">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    className="size-12 rounded-lg object-cover object-center"
                    src="/images/technology/man-tablet.jpg"
                    alt="cover"
                  />
                  <p className="text-xs-plus">Oct 27, 2021</p>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
                  Chat Mobile App
                </h3>
                <p className="text-xs-plus">Prototyping</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-xs-plus text-gray-800 dark:text-dark-100">
                    Progress
                  </p>
                  <Progress
                    value={64}
                    color="secondary"
                    classNames={{
                      root: "my-2 h-1.5",
                    }}
                  />
                  <p className="text-end text-xs-plus font-medium text-this dark:text-this-lighter">
                    64%
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap -space-x-2 ">
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    src="/images/avatar/avatar-6.jpg"
                  />
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    name="Emilie Clarke"
                    initialColor="secondary"
                  />
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    src="/images/avatar/avatar-20.jpg"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge
                    color="secondary"
                    className="h-5.5 rounded-full px-2 text-xs-plus"
                  >
                    6 week left
                  </Badge>
                  <Button
                    isIcon
                    variant="flat"
                    className="size-8 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <Cog6ToothIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </Box>
          </Box>

          <Box className="flex flex-col rounded-lg bg-white dark:bg-dark-700">
            <Box className="this:success flex flex-1 flex-col justify-between rounded-lg bg-this/[.15] p-4 dark:bg-transparent sm:p-5">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    className="size-12 rounded-lg object-cover object-center"
                    src="/images/technology/dashboard.jpg"
                    alt="cover"
                  />
                  <p className="text-xs-plus">Sep 16, 2021</p>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
                  Store Dashboard
                </h3>
                <p className="text-xs-plus">UI/UX Design</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-xs-plus text-gray-800 dark:text-dark-100">
                    Progress
                  </p>
                  <Progress
                    value={45}
                    color="success"
                    classNames={{
                      root: "my-2 h-1.5",
                    }}
                  />
                  <p className="text-end text-xs-plus font-medium text-this dark:text-this-lighter">
                    45%
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap -space-x-2 ">
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    src="/images/avatar/avatar-6.jpg"
                  />
                  <Avatar
                    size={7}
                    className="origin-bottom transition-transform hover:z-10 hover:scale-125"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    name="Selena Gomez"
                    initialColor="success"
                  />

                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    src="/images/avatar/avatar-11.jpg"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge
                    color="success"
                    className="h-5.5 rounded-full px-2 text-xs-plus"
                  >
                    3 week left
                  </Badge>
                  <Button
                    isIcon
                    variant="flat"
                    className="size-8 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <Cog6ToothIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </Box>
          </Box>

          <Box className="flex flex-col rounded-lg bg-white dark:bg-dark-700">
            <Box className="this:error flex flex-1 flex-col justify-between rounded-lg bg-this/[.15] p-4 dark:bg-transparent sm:p-5">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    className="size-12 rounded-lg object-cover object-center"
                    src="/images/technology/ai-technology-brain.jpg"
                    alt="cover"
                  />
                  <p className="text-xs-plus">Jan 03, 2021</p>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
                  NFT Marketplace App
                </h3>
                <p className="text-xs-plus">Prototyping</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-xs-plus text-gray-800 dark:text-dark-100">
                    Progress
                  </p>
                  <Progress
                    value={69}
                    color="error"
                    classNames={{
                      root: "my-2 h-1.5",
                    }}
                  />
                  <p className="text-end text-xs-plus font-medium text-this dark:text-this-lighter">
                    69%
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap -space-x-2 ">
                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-3.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    initialColor="error"
                    name="Leo Clarke"
                  />
                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-17.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge
                    color="error"
                    className="h-5.5 rounded-full px-2 text-xs-plus"
                  >
                    4 week left
                  </Badge>
                  <Button
                    isIcon
                    variant="flat"
                    className="size-8 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <Cog6ToothIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </Box>
          </Box>

          <Box className="flex flex-col rounded-lg bg-white dark:bg-dark-700">
            <Box className="this:primary flex flex-1 flex-col justify-between rounded-lg bg-this/[.15] p-4 dark:bg-transparent sm:p-5">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    className="size-12 rounded-lg object-cover object-center"
                    src="/images/technology/mobile-social.jpg"
                    alt="cover"
                  />
                  <p className="text-xs-plus">May 09, 2021</p>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
                  Mobile App
                </h3>
                <p className="text-xs-plus">Prototyping</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-xs-plus text-gray-800 dark:text-dark-100">
                    Progress
                  </p>
                  <Progress
                    value={56}
                    color="primary"
                    classNames={{
                      root: "my-2 h-1.5",
                    }}
                  />
                  <p className="text-end text-xs-plus font-medium text-this dark:text-this-lighter">
                    56%
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap -space-x-2 ">
                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-15.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />
                  <Avatar
                    size={7}
                    color="primary"
                    name="Leo Clarke"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />

                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-13.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge
                    color="primary"
                    className="h-5.5 rounded-full px-2 text-xs-plus"
                  >
                    2 week left
                  </Badge>
                  <Button
                    isIcon
                    variant="flat"
                    className="size-8 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <Cog6ToothIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </Box>
          </Box>

          <Box className="flex flex-col rounded-lg bg-white dark:bg-dark-700">
            <Box className="this:warning flex flex-1 flex-col justify-between rounded-lg bg-this/[.15] p-4 dark:bg-transparent sm:p-5">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    className="size-12 rounded-lg object-cover object-center"
                    src="/images/technology/man-tablet.jpg"
                    alt="cover"
                  />
                  <p className="text-xs-plus">Jan 03, 2021</p>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
                  LMS App Design
                </h3>
                <p className="text-xs-plus">UI/UX Design</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-xs-plus text-gray-800 dark:text-dark-100">
                    Progress
                  </p>
                  <Progress
                    value={78}
                    color="warning"
                    classNames={{
                      root: "my-2 h-1.5",
                    }}
                  />
                  <p className="text-end text-xs-plus font-medium text-this dark:text-this-lighter">
                    78%
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap -space-x-2 ">
                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-20.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />
                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    name="John Doe"
                    initialColor="warning"
                  />
                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-20.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge
                    color="warning"
                    className="h-5.5 rounded-full px-2 text-xs-plus"
                  >
                    2 week left
                  </Badge>
                  <Button
                    isIcon
                    variant="flat"
                    className="size-8 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <Cog6ToothIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </Box>
          </Box>

          <Box className="flex flex-col rounded-lg bg-white dark:bg-dark-700">
            <Box className="this:info flex flex-1 flex-col justify-between rounded-lg bg-this/[.15] p-4 dark:bg-transparent sm:p-5">
              <div>
                <div className="flex items-start justify-between">
                  <img
                    className="size-12 rounded-lg object-cover object-center"
                    src="/images/technology/design-sm.jpg"
                    alt="cover"
                  />
                  <p className="text-xs-plus">June 04, 2021</p>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
                  Design Learn Management System
                </h3>
                <p className="text-xs-plus">UI/UX Design</p>
              </div>
              <div>
                <div className="mt-4">
                  <p className="text-xs-plus text-gray-800 dark:text-dark-100">
                    Progress
                  </p>
                  <Progress
                    value={25}
                    color="info"
                    classNames={{
                      root: "my-2 h-1.5",
                    }}
                  />
                  <p className="text-end text-xs-plus font-medium text-this dark:text-this-lighter">
                    25%
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap -space-x-2 ">
                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-3.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />

                  <Avatar
                    size={7}
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                    name="John Doe"
                    initialColor="info"
                  />

                  <Avatar
                    size={7}
                    src="/images/avatar/avatar-17.jpg"
                    classNames={{
                      root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                      display: "text-xs-plus ring-3 ring-white dark:ring-dark-700",
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Badge
                    color="info"
                    className="h-5.5 rounded-full px-2 text-xs-plus"
                  >
                    1 week left
                  </Badge>
                  <Button
                    isIcon
                    variant="flat"
                    className="size-8 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <Cog6ToothIcon className="size-5" />
                  </Button>
                </div>
              </div>
            </Box>
          </Box>
        </div>
      </div>
    </Page>
  );
}
