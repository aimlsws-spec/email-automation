import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function ProductionBuild() {
  return (
    <section>
      <h3
        id="production-build"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="Production Build"
        data-order="2"
      >
        <a href="#production-build">Production Build</a>
      </h3>
      <div className="mt-5 space-y-4 text-sm-plus">
        <div>
          <p>To prepare your project for production, follow these steps: </p>
          <ul className="mt-5 list-outside list-disc space-y-5">
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>Build the Project:</strong>
              <p className="mt-1">
                Use the following command to generate the production-ready
                build:
              </p>
              <div className="mt-4 text-sm">
                <SyntaxHighlighter language="bash">
                  yarn build
                </SyntaxHighlighter>
              </div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>Output Directory:</strong>
              <p className="mt-1 inline-code">
                The optimized production files will be generated in the{" "}
                <code>dist/</code>
                directory. This folder contains minified assets, ready to be
                deployed to a production server.
              </p>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>Preview the Build:</strong>
              <p className="mt-1">
                To verify the production build locally, use the following
                command:
              </p>
              <div className="mt-4 text-sm">
                <SyntaxHighlighter language="bash">
                  yarn preview
                </SyntaxHighlighter>
              </div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>Deployment:</strong>
              <p className="mt-1 inline-code">
                Deploy the contents of the <code>dist/</code> folder to your
                preferred hosting provider, such as Vercel, Netlify, or any
                static hosting platform.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
