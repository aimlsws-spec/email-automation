// Local Imports
import { Card } from "components/ui";
import Logo from "assets/appLogo.svg?react";
import LogoType from "assets/logotype.svg?react";
import TailwindIcon from "assets/tailwind.svg?react";
import ReactIcon from "assets/react.svg?react";
import HeadlessIcon from "assets/headlessui.svg?react";
import ReactRouterIcon from "assets/react-router-dom.svg?react";

// ----------------------------------------------------------------------

const technologies = [
  {
    Logo: TailwindIcon,
    label: "TailwindCSS",
    href: "https://tailwindcss.com/",
  },
  {
    Logo: ReactIcon,
    label: "React",
    href: "https://react.dev/",
  },
  {
    Logo: HeadlessIcon,
    label: "Headless UI",
    href: "https://headlessui.com/",
  },
  {
    Logo: ReactRouterIcon,
    label: "React Router",
    href: "https://reactrouter.com/",
  },
];

export function Hero() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card className="text-balance p-4 text-sm sm:p-5">
        <div className="flex items-center gap-3">
          <Logo className="size-10 text-primary-600 dark:text-primary-400" />
          <LogoType className="h-5 w-auto text-gray-800 dark:text-dark-50" />
        </div>
        <p className="mt-4">
          Tailux is a versatile Admin and Webapp UI Kit built on React (JavaScript and TypeScript) and the
          TailwindCSS Framework. It features a wide range of reusable
          components, layouts, forms, dashboards, fully functional datatables,
          and web app templates. Tailux is a robust, ultra-responsive, modern,
          and highly flexible UI Kit designed for building cutting-edge web
          applications. Whether you&apos;re developing a SaaS platform, custom
          admin panels, dashboards, CRMs, CMSs, LMSs, AI-powered apps, crypto
          tools, banking solutions, or e-commerce platforms.
        </p>
      </Card>
      <div className="grid grid-cols-2 gap-5">
        {technologies.map(({ Logo, label, href }) => (
          <Card
            key={label}
            className="relative flex flex-col justify-center overflow-hidden p-4"
          >
            <div>
              <Logo className="mx-auto h-8" />
            </div>
            <p className="mt-3 text-center text-base font-medium">{label}</p>
            <a href={href} className="absolute inset-0 hover:bg-white/5"></a>
          </Card>
        ))}
      </div>
    </div>
  );
}
