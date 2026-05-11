// Import Dependencies
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Button, Card } from "components/ui";
import { getChartConfig } from "./chartConfig";

// ----------------------------------------------------------------------

const socialIcons = {
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
};

export function AuthorCard({
  avatar,
  cover,
  color,
  socialLinks,
  chartData,
  name,
  location,
  postsCount,
  follows,
}) {
  const socialButtons = Object.entries(socialLinks).map(([label, link]) => ({
    label,
    Icon: socialIcons[label],
    link,
  }));

  return (
    <Card className="flex flex-col">
      <div className="h-20 rounded-t-lg bg-primary-500">
        <img
          src={cover}
          alt="cover"
          className="h-full w-full rounded-t-lg object-cover object-center"
        />
      </div>
      <div className="flex grow flex-col px-4 py-2 sm:px-5">
        <div className="flex justify-between gap-4">
          <Avatar
            size={20}
            initialColor={color}
            name={name}
            src={avatar}
            classNames={{
              root: "-mt-12",
              display: "border-2 border-white text-2xl dark:border-dark-700",
            }}
          />

          <div className="flex gap-2">
            {socialButtons.map((item) => (
              <Button
                key={item.label}
                color="primary"
                variant="soft"
                className="size-7 rounded-full"
                isIcon
                component="a"
                href={item.link}
                aria-label={item.label}
              >
                <item.Icon className="size-4" />
              </Button>
            ))}
          </div>
        </div>
        <h3 className="pt-2 text-lg font-medium text-gray-800 dark:text-dark-100">
          {name}
        </h3>
        <p className="text-xs">{location}</p>

        <div className="flex grow items-center gap-3 py-3">
          <div className="min-w-0">
            <Chart
              className="ax-transparent-gridline w-2/3"
              series={[
                {
                  name: "Posts",
                  data: chartData,
                },
              ]}
              height="85"
              options={getChartConfig(color)}
              type="bar"
            />
          </div>

          <div className="w-3/12 text-center">
            <p className="text-xl font-medium text-gray-800 dark:text-dark-100">
              {postsCount}
            </p>
            <p className="text-xs-plus">Posts</p>
          </div>
        </div>

        <div className="flex justify-between py-2">
          <div className="flex -space-x-2 ">
            {follows.map((follow) => (
              <Avatar
                size={7}
                key={follow.uid}
                name={follow.name}
                src={follow.avatar}
                initialColor="auto"
                classNames={{
                  display: "text-xs ring-2 ring-white dark:ring-dark-700",
                }}
              />
            ))}
          </div>

          <Button
            className="size-7 rounded-full ltr:-mr-2 rtl:-ml-2"
            variant="flat"
            isIcon
          >
            <Cog6ToothIcon className="size-4.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

AuthorCard.propTypes = {
  avatar: PropTypes.string,
  cover: PropTypes.string,
  color: PropTypes.string,
  socialLinks: PropTypes.object,
  chartData: PropTypes.array,
  name: PropTypes.string,
  location: PropTypes.string,
  postsCount: PropTypes.string,
  follows: PropTypes.array,
};
