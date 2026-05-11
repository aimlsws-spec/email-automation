import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Installation() {
  return (
    <section>
      <h3
        id="installation"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="Installation"
        data-order="2"
      >
        <a href="#installation">Installation</a>
      </h3>
      <div className="mt-5 text-sm-plus">
        <p>
          Please download the latest version of Tailux from the official{" "}
          <a
            href="#"
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            ThemeForest
          </a>{" "}
          website and extract the zip file into your project directory. Once
          extracted, you will find two folders:
        </p>
        <ul className="mt-5 list-outside list-disc space-y-5">
          <li className="ltr:ml-4 rtl:mr-4">
            <strong>Demo</strong>
            <div className="mt-2">
              This folder contains the demo pages of the Tailux theme. We do not
              recommend using this folder in your project, as it is intended for
              reference purposes only.
            </div>
          </li>
          <li className="ltr:ml-4 rtl:mr-4">
            <strong>Starter</strong>
            <div className="mt-2">
              The starter package contains all the necessary files to begin
              working with Tailux. Use this folder to build your application.
            </div>
          </li>
        </ul>
        <div>
          <div className="mt-5">
            <p className="inline-code">
              Navigate to the <code>starter</code> folder (where the{" "}
              <code>package.json</code> file is located) and run the following
              command to install the required dependencies:
            </p>
            <div className="text-sm">
              <SyntaxHighlighter language="bash">yarn</SyntaxHighlighter>
            </div>
            <p>
              This will create a <code>node_modules</code> folder in your
              project directory containing all the installed dependencies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
