// Import Dependencies
import { ArrowUpIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar } from "components/ui";
import { SellerCard } from "./SellerCard";

// ----------------------------------------------------------------------

const sellers = [
  {
    uid: "1",
    name: "Travis Fuller",
    avatar: "/images/avatar/avatar-5.jpg",
    messages: 2,
    mails: 4,
    sells: 2348,
    target: 3000,
    clients: 78,
    relations: {
      calls: 0.33,
      chatMessages: 0.17,
      emails: 0.5,
    },
    awards: [
      {
        uid: '1',
        label: "Award level 1",
        image: "/images/awards/award-19.svg",
      },
      {
        uid: '2',
        label: "Award level 2",
        image: "/images/awards/award-2.svg",
      },
      {
        uid: '3',
        label: "Award level 3",
        image: "/images/awards/award-5.svg",
      },
    ],
  },
  {
    uid: "2",
    name: "Konnor Guzman",
    avatar: "/images/avatar/avatar-18.jpg",
    messages: null,
    mails: 2,
    sells: 1451,
    target: 2000,
    clients: 54,
    relations: {
      calls: 0.24,
      chatMessages: 0.56,
      emails: 0.2,
    },
    awards: [
      {
        uid: '1',
        label: "Award level 1",
        image: "/images/awards/award-1.svg",
      },
      {
        uid: '2',
        label: "Award level 2",
        image: "/images/awards/award-6.svg",
      },
      {
        uid: '3',
        label: "Award level 3",
        image: "/images/awards/award-9.svg",
      },
    ],
  },
  {
    uid: "3",
    name: "Alfredo Elliott",
    avatar: "/images/avatar/avatar-6.jpg",
    messages: 4,
    mails: null,
    sells: 423,
    target: 500,
    clients: 16,
    relations: {
      calls: 0.6,
      chatMessages: 0.23,
      emails: 0.17,
    },
    awards: [
      {
        uid: '1',
        label: "Award level 1",
        image: "/images/awards/award-14.svg",
      },
      {
        uid: '2',
        label: "Award level 2",
        image: "/images/awards/award-13.svg",
      },
    ],
  },
  {
    uid: "4",
    name: "Samantha Shelton",
    avatar: "/images/avatar/avatar-11.jpg",
    messages: null,
    mails: 2,
    sells: 579,
    target: 800,
    clients: 24,
    relations: {
      calls: 0.4,
      chatMessages: 0.36,
      emails: 0.24,
    },
    awards: [
      {
        uid: '1',
        label: "Award level 1",
        image: "/images/awards/award-15.svg",
      },
      {
        uid: '2',
        label: "Award level 2",
        image: "/images/awards/award-13.svg",
      },
    ],
  },
  {
    uid: "5",
    name: "Derrick Simmons",
    avatar: "/images/avatar/avatar-19.jpg",
    messages: null,
    mails: null,
    sells: 6541,
    target: 8000,
    clients: 145,
    relations: {
      calls: 0.55,
      chatMessages: 0.3,
      emails: 0.15,
    },
    awards: [
      {
        uid: '1',
        label: "Award level 1",
        image: "/images/awards/award-15.svg",
      },
      {
        uid: '2',
        label: "Award level 2",
        image: "/images/awards/award-5.svg",
      },
      {
        uid: '3',
        label: "Award level 3",
        image: "/images/awards/award-25.svg",
      },
    ],
  },
  {
    uid: "6",
    name: "Katrina West",
    avatar: "/images/avatar/avatar-7.jpg",
    messages: null,
    mails: 1,
    sells: 3481,
    target: 5000,
    clients: 96,
    relations: {
      calls: 0.09,
      chatMessages: 0.41,
      emails: 0.5,
    },
    awards: [
      {
        uid: '1',
        label: "Award level 1",
        image: "/images/awards/award-1.svg",
      },
      {
        uid: '2',
        label: "Award level 2",
        image: "/images/awards/award-24.svg",
      },
      {
        uid: '3',
        label: "Award level 3",
        image: "/images/awards/award-30.svg",
      },
    ],
  },
];

export function TopSellers() {
  return (
    <div className="mt-4 grid grid-cols-12 gap-4 bg-gray-150 py-5 dark:bg-dark-800 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
      <div className="transition-content col-span-12 flex flex-col px-(--margin-x) lg:col-span-3 lg:ltr:pr-0 lg:rtl:pl-0">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100 lg:text-xl">
          Top Sellers
        </h2>

        <p className="mt-3 grow">
          The top sellers is calculated based on the sales of a product and
          undergoes hourly updations.
        </p>

        <div className="mt-4">
          <p>Sales Growth</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Avatar size={7} initialColor="success" initialVariant="soft">
              <ArrowUpIcon className="size-4" />
            </Avatar>
            <p className="text-base font-medium text-gray-800 dark:text-dark-100">
              $2,225.22
            </p>
          </div>
        </div>
      </div>

      <div className="hide-scrollbar transition-content col-span-12 flex gap-4 overflow-x-auto px-(--margin-x) lg:col-span-9 lg:ltr:pl-0 lg:rtl:pr-0">
        {sellers.map((seller) => (
          <SellerCard key={seller.uid} {...seller} />
        ))}
      </div>
    </div>
  );
}
