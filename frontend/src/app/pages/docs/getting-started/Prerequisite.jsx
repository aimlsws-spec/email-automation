import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Prerequisite() {
  return (
    <section>
      <h3
        id="prerequisite"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="Prerequisite"
        data-order="2"
      >
        <a href="#prerequisite">Prerequisite</a>
      </h3>
      <div className="mt-5 text-sm-plus">
        <div className="space-y-3">
          <p>
            Tailux is built using <strong>ReactJS</strong> and{" "}
            <strong>Tailwind CSS</strong>. To work effectively with Tailux, its
            important to have a foundational understanding of these
            technologies. ReactJS enables you to build dynamic and interactive
            web applications, while Tailwind CSS allows for rapid styling using
            utility-first CSS classes.
          </p>
          <p>
            In addition to ReactJS and Tailwind CSS, knowledge of HTML, CSS, and
            JavaScript is highly recommended. These core web development skills
            will help you understand and modify Tailux structure, design, and
            interactivity as needed.
          </p>
          <p>
            For development, a reliable text editor or IDE, such as{" "}
            <strong>Visual Studio Code</strong> or <strong>WebStorm</strong>, is
            suggested for an enhanced coding experience.
          </p>
          <p>
            To get started, ensure <strong>Node.js</strong> is installed on your
            machine. We recommend using the Node.js LTS version. You will also
            need a dependency manager like npm or yarn, with{" "}
            <strong>yarn</strong> being the preferred choice for Tailux.
          </p>
        </div>
        <div className="mt-8">
          <p>To verify if Node.js is installed, run the following command:</p>
          <SyntaxHighlighter language="bash">node -v</SyntaxHighlighter>
        </div>
        <div className="mt-8">
          <p>To verify if yarn is installed, run the following command:</p>
          <SyntaxHighlighter language="bash">yarn -v</SyntaxHighlighter>
        </div>
        <div className="mt-8 space-y-3">
          <p>
            To ensure you are always using the latest features, bug fixes, and
            security updates, its important to stay up to date with the
            changelogs and new releases for the core technologies used in
            Tailux:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>ReactJS:</strong> Check the React{" "}
              <a
                href="https://react.dev/blog"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                blog
              </a>{" "}
              for updates on new features, improvements, and breaking changes.
            </li>
            <li>
              <strong>Tailwind CSS:</strong> Follow the Tailwind{" "}
              <a
                href="https://tailwindcss.com/blog"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                blog
              </a>{" "}
              for the latest updates to their utility classes, configurations,
              and plugins.
            </li>
            <li>
              <strong>Tailux:</strong> Monitor the official Tailux{" "}
              <a
                href="/docs/changelogs"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                changelog
              </a>{" "}
              to stay informed about new features and best practices specific to
              this framework.
            </li>
          </ul>
          <p>
            Keeping up with these updates will help you take full advantage of
            the latest enhancements and ensure your development process remains
            smooth and efficient.
          </p>
        </div>
      </div>
    </section>
  );
}
