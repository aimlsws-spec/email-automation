import { Table, TBody, Td, Th, THead, Tr } from "components/ui";

const dependencies = [
  {
    label: "@atlaskit/pragmatic-drag-and-drop",
    url: "https://github.com/atlassian/pragmatic-drag-and-drop",
  },
  {
    label: "@formkit/auto-animate",
    url: "https://auto-animate.formkit.com/",
  },
  {
    label: "@headlessui/react",
    url: "https://headlessui.com/",
  },
  {
    label: "https://heroicons.com/",
    url: "https://heroicons.com/",
  },
  {
    label: "@tanem/react-nprogress",
    url: "https://github.com/tanem/react-nprogress",
  },
  {
    label: "@tanstack/react-table",
    url: "https://tanstack.com/table/latest",
  },
  {
    label: "apexcharts",
    url: "https://apexcharts.com/",
  },
  {
    label: "Axios",
    url: "https://axios-http.com/docs/intro",
  },
  {
    label: "cleave.js",
    url: "https://nosir.github.io/cleave.js/",
  },
  {
    label: "color",
    url: "https://github.com/Qix-/color",
  },
  {
    label: "dayjs",
    url: "https://day.js.org/",
  },
  {
    label: "ESLint",
    url: "https://eslint.org/",
  },
  {
    label: "Filepond",
    url: "https://pqina.nl/filepond/",
  },
  {
    label: "fuse.js",
    url: "https://www.fusejs.io/",
  },
  {
    label: "html-react-parser",
    url: "https://github.com/remarkablemark/html-react-parser",
  },
  {
    label: "i18next",
    url: "https://www.i18next.com/",
  },
  {
    label: "jwt-decode",
    url: "https://jwt.io/",
  },
  {
    label: "quill",
    url: "https://quilljs.com/",
  },
  {
    label: "quill-magic-url",
    url: "https://github.com/visualjerk/quill-magic-url",
  },
  {
    label: "React",
    url: "https://react.dev/",
  },
  {
    label: "react-confetti",
    url: "https://github.com/alampros/react-confetti",
  },
  {
    label: "react-dropzone",
    url: "https://github.com/react-dropzone/react-dropzone",
  },
  {
    label: "react-fast-marquee",
    url: "https://www.react-fast-marquee.com/",
  },
  {
    label: "react-filepond",
    url: "https://pqina.nl/filepond/docs/getting-started/installation/react/",
  },
  {
    label: "React Hook Form",
    url: "https://react-hook-form.com/",
  },
  {
    label: "react-icons",
    url: "https://react-icons.github.io/react-icons/",
  },
  {
    label: "react-markdown",
    url: "https://remarkjs.github.io/react-markdown/",
  },
  {
    label: "react-router",
    url: "https://reactrouter.com/",
  },
  {
    label: "React Syntax Highlighter",
    url: "https://github.com/react-syntax-highlighter/react-syntax-highlighter",
  },
  {
    label: "react-textarea-autosize",
    url: "https://github.com/Andarist/react-textarea-autosize",
  },
  {
    label: "react-timer-hook",
    url: "https://github.com/amrlabib/react-timer-hook",
  },
  {
    label: "react-to-print",
    url: "https://www.npmjs.com/package/react-to-print",
  },
  {
    label: "react-tooltip",
    url: "https://www.npmjs.com/package/react-tooltip",
  },
  {
    label: "simplebar-react",
    url: "https://www.npmjs.com/package/simplebar-react",
  },
  {
    label: "sonner",
    url: "https://sonner.emilkowal.ski/",
  },
  {
    label: "swiperjs",
    url: "https://swiperjs.com/",
  },
  {
    label: "tiny-invariant",
    url: "https://github.com/alexreardon/tiny-invariant",
  },
  {
    label: "yup",
    url: "https://github.com/jquense/yup",
  },
  {
    label: "prettier",
    url: "https://prettier.io/",
  },
  {
    label: "tailwindcss",
    url: "https://tailwindcss.com/",
  },
  {
    label: "vite",
    url: "https://vite.dev/",
  },
];

export function Dependencies() {
  return (
    <section>
      <h3
        id="dependencies"
        className="mt-10 scroll-mt-20 text-lg font-semibold lg:text-2xl"
        data-heading="Dependencies"
        data-order="2"
      >
        <a href="#dependencies">Dependencies</a>
      </h3>

      <div className="hide-scrollbar mt-5 min-w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-dark-500">
        <Table zebra className="w-full text-left rtl:text-right">
          <THead>
            <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
              <Th className="font-semibold uppercase text-gray-800 dark:text-dark-100">
                Name
              </Th>
              <Th className="font-semibold uppercase text-gray-800 dark:text-dark-100">
                URL
              </Th>
            </Tr>
          </THead>
          <TBody>
            {dependencies.map((tr) => (
              <Tr
                key={tr.label}
                className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
              >
                <Td>{tr.label}</Td>
                <Td className="min-w-0">
                  <a
                    href={tr.url}
                    className="text-primary-600 hover:underline dark:text-primary-400"
                  >
                    <span className="truncate">{tr.url}</span>
                  </a>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </section>
  );
}
