// Import Dependencies
import {
  ChatBubbleLeftIcon,
  ViewColumnsIcon,
  CloudIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaN, FaCar, FaShapes } from "react-icons/fa6";
import { RiRobot2Line } from "react-icons/ri";
import { Link } from "react-router";

// Local Imports
import { Page } from "components/shared/Page";
import { randomId } from "utils/randomId";
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

const apps = [
  {
    id: randomId(),
    logo: ChatBubbleLeftIcon,
    color: "info",
    name: "Chat App",
    text: "Tailux prebuilt Messaging UI kit includes designs for social chat.",
    path: "/apps/chat",
  },
  {
    id: randomId(),
    logo: ViewColumnsIcon,
    color: "warning",
    name: "Kanban Board",
    text: "The Kanban Board to keep track of your personal and work tasks.",
    path: "/apps/kanban",
  },
  {
    id: randomId(),
    logo: CloudIcon,
    color: "secondary",
    name: "File Manager",
    text: "Tailux File Manager UI Kit is designed with modern design trends.",
    path: "/apps/filemanager",
  },
  {
    id: randomId(),
    logo: FaMoneyBillWave,
    color: "primary",
    name: "Todo App",
    text: "Tailux Todo UI kit is a simple to-do list and an task management app.",
    path: "/apps/todo",
  },
  {
    id: randomId(),
    logo: RiRobot2Line,
    color: "warning",
    name: "Ai Chat App",
    text: "Tailux Ai Chat is a prebuild AI chatbot that writes text. You can use it to write stories, messages, or programming code.",
    path: "/apps/ai-chat",
  },
  {
    id: randomId(),
    logo: EnvelopeIcon,
    color: "error",
    name: "Mail App",
    text: "Tailux prebuilt Mail UI kit includes designs for email system.",
    path: "/apps/mail",
  },
  {
    id: randomId(),
    logo: FaN,
    color: "success",
    name: "NFT Marketplace V1",
    text: "Tailux NFT Store UI Kit is responsive and high-quality UI design kit for the NFT marketplace.",
    path: "/apps/nft-1",
  },
  {
    id: randomId(),
    logo: FaN,
    color: "info",
    name: "NFT Marketplace V2",
    text: "Tailux NFT Store UI Kit is responsive and high-quality UI design kit for the NFT marketplace.",
    path: "/apps/nft-2",
  },
  {
    id: randomId(),
    logo: FaMoneyBillWave,
    color: "warning",
    name: "Point of Sales",
    text: "Tailux POS UI Kit is responsive and high-quality UI design kit for the Point of sale system.",
    path: "/apps/pos",
  },
  {
    id: randomId(),
    logo: FaCar,
    color: "primary",
    name: "Travel",
    text: "Tailux Travel UI Kit is responsive and high-quality UI design kit for the travel agancy wesites.",
    path: "/apps/travel",
  },
];

export default function AppsList() {
  return (
    <Page title="NFT App v2">
      <div className="transition-content px-(--margin-x) pb-8">
        <div className="mt-12 text-center">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-linear-to-br from-pink-500 to-rose-500 text-white">
            <FaShapes className="size-8" />
          </div>
          <h3 className="mt-3 text-xl font-semibold text-gray-800 dark:text-dark-100">
            Tailux Applications
          </h3>
          <p className="mt-0.5 text-base">
            List of prebuilt applications of Tailux
          </p>
        </div>
        <div className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {apps.map((app) => (
            <Card className="flex flex-col p-4 sm:p-5" key={app.id}>
              <Avatar size={12} initialColor={app.color}>
                <app.logo className="size-6" />
              </Avatar>
              <h2 className="mt-5 line-clamp-1 text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
                {app.name}
              </h2>
              <p className="mt-1 grow">{app.text}</p>
              <div className="mt-5 pb-1">
                <Link
                  to={app.path}
                  className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
                >
                  View Application
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}
