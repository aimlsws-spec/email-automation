import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Starter() {
  return (
    <section>
      <h3
        id="starter"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="Starter"
        data-order="2"
      >
        <a href="#starter">Starter</a>
      </h3>
      <div className="mt-5 space-y-4 text-sm-plus">
        <p>Steps to Add a New Page:</p>
        <ul className="list-outside list-disc space-y-5">
          <li className="ltr:ml-4 rtl:mr-4">
            <strong>Define Your Page Name</strong>
            <div className="mt-2 inline-code">
              Choose a name for your page, example: <code>Example</code>
            </div>
          </li>
          <li className="ltr:ml-4 rtl:mr-4">
            <strong>Create the Page File</strong>
            <ul className="mt-5 list-outside list-disc space-y-4">
              <li className="ltr:ml-4 rtl:mr-4">
                <div>
                  Navigate to <code>src/app/pages/dashboards</code>
                </div>
              </li>
              <li className="ltr:ml-4 rtl:mr-4">
                <div className="inline-code">
                  Create your page folder and file, e.g.,{" "}
                  <code>example/index.jsx</code>.
                </div>
              </li>
              <li className="ltr:ml-4 rtl:mr-4">
                <div>
                  Inside the file, define the function with the same name as
                  your page:
                </div>
                <div className="text-sm">
                  <SyntaxHighlighter language="jsx">{`import { Page } from "components/shared/Page";

export default function Home() {
  return (
    <Page title="Example">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Example Page
          </h2>
        </div>
      </div>
    </Page>
  );
}`}</SyntaxHighlighter>
                </div>
              </li>
            </ul>
          </li>

          <li className="ltr:ml-4 rtl:mr-4">
            <strong>Add the Page to Navigation </strong>
            <ul className="mt-5 list-outside list-disc space-y-4">
              <li className="ltr:ml-4 rtl:mr-4">
                <div className="inline-code">
                  Open <code>src/app/navigation/dashboards.js</code>.
                </div>
              </li>
              <li className="ltr:ml-4 rtl:mr-4">
                <div>Add an object for your page:</div>
                <div className="text-sm">
                  <SyntaxHighlighter language="js">
                    {`export const dashboards = {
    // ...
    childs: [
        // ...
        {
            id: 'dashboards.example', // Unique identifier
            path: 'dashboards/example', // Route path
            type: NAV_TYPE_ITEM, // Item type (NAV_TYPE_ITEM, NAV_TYPE_ROOT, or NAV_TYPE_COLLAPSE)
            title: 'Example', // Title
            transKey: 'nav.dashboards.example', // Translation key (optional)
            Icon: ExampleIcon, // Icon component (optional)
        },
    ],
};`}
                  </SyntaxHighlighter>
                </div>
              </li>
            </ul>
          </li>

          <li className="ltr:ml-4 rtl:mr-4">
            <strong>Add the Page to the Router</strong>
            <ul className="mt-5 list-outside list-disc space-y-4">
              <li className="ltr:ml-4 rtl:mr-4">
                <div>
                  Decide whether your page should be public, protected, or
                  ghost.
                </div>
              </li>
              <li className="ltr:ml-4 rtl:mr-4">
                <div className="inline-code">
                  Navigate to the relevant router file, e.g.,
                  <code>src/app/router/protected.jsx.</code>
                </div>
              </li>
              <li className="ltr:ml-4 rtl:mr-4">
                <div>Add the route for your page:</div>
                <div className="text-sm">
                  <SyntaxHighlighter language="jsx">
                    {`const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: DynamicLayout,
      children: [
        {
          path: "dashboards",
          children: [
            // ...
            {
              path: "example",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/example")).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };`}
                  </SyntaxHighlighter>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <p>
          Congratulations! You are successfully added a new page. Feel free to
          explore and customize the page as needed.
        </p>
      </div>
    </section>
  );
}
