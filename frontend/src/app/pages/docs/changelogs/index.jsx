// Import Dependencies
import dayjs from "dayjs";
import parse from "html-react-parser";

// Local Imports
import { Page } from "components/shared/Page";
import { Toc } from "components/template/Toc";

// ----------------------------------------------------------------------

const releases = [
  {
    v: "1.0.0",
    date: "02.03.2025",
    changes: ["Initial Release"],
  },
  {
    v: "1.0.1",
    date: "02.04.2025",
    changes: ["Fix Zed browser issue"],
  },
  {
    v: "1.0.3",
    date: "02.10.2025",
    changes: [
      "Fix Firefox RTL langs issue (Update /src/app/contexts/locale/Provider.jsx file)",
    ],
  },
  {
    v: "1.1.0",
    date: "03.12.2025",
    changes: ["Add Gradient Circlebar and Progress"],
  },
  {
    v: "1.1.1",
    date: "03.17.2025",
    changes: ["Fix Safari table select issue"],
  },
  {
    v: "1.2.0",
    date: "03.26.2025",
    changes: [
      "<b class='text-primary-500'>Upgrade to TailwindCSS v4</b>",
      "Update dependencies",
    ],
  },
  {
    v: "1.2.1",
    date: "03.28.2025",
    changes: ["Fix Tailwind CSS v4 minor issues"],
  },
  {
    v: "1.3.0",
    date: "05.25.2025",
    changes: [
      "<b class='text-primary-500'>Typescript Edition</b>",
      "Move from `shadow-sm` to `shadow` for `Card` component and `Theme` context",
      "Update dependencies",
    ],
  },
  {
    v: "1.3.1",
    date: "08.04.2025",
    changes: [
      "<b class='text-primary-500'>Update to Vite 7</b>",
      "Update dependencies",
      "Fix minor issues",
    ],
  },
  {
    v: "1.3.2",
    date: "08.15.2025",
    changes: [
      "Fix Minor Tables Issues",
      "Update dependencies",
    ],
  },
];

export default function Changelogs() {
  return (
    <Page title="Changelogs">
      <div className="transition-content grid grid-cols-4 gap-8 px-(--margin-x) pt-5 pb-16 lg:pt-6 2xl:gap-16">
        <div className="col-span-4 space-y-8 lg:col-span-3" id="changelog-root">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="dark:text-dark-50 text-xl font-medium tracking-wide text-gray-800 lg:text-2xl 2xl:text-3xl">
              Changelogs
            </h1>
          </div>
          <div className="mx-auto max-w-4xl">
            {releases.map((item) => (
              <section key={item.v}>
                <h3
                  id={item.v}
                  className="mt-10 scroll-mt-20 text-lg font-semibold lg:text-2xl"
                  data-heading={`Version ${item.v}`}
                  data-order="2"
                >
                  <a href="#icons" className="dark:text-dark-50 text-gray-800">
                    Version {item.v}
                  </a>
                </h3>

                <div className="mt-2">
                  <time className="text-base">
                    {dayjs(item.date).format("DD MMMM, YYYY")}
                  </time>
                </div>

                <ul className="mt-4 list-inside list-disc space-y-1.5 text-base">
                  {item.changes.map((item, i) => (
                    <li key={i}>{parse(item)}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
        <Toc wrapperSelector="#changelog-root" />
      </div>
    </Page>
  );
}
