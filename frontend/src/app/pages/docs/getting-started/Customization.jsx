import clsx from "clsx";

import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";
import { Button, Card } from "components/ui";
import { useToggle } from "hooks";
import { setThisClass } from "utils/setThisClass";

export function Customization() {
  return (
    <section>
      <h3
        id="customization"
        className="dark:border-dark-500 mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold lg:text-2xl"
        data-heading="Customization"
        data-order="2"
      >
        <a href="#customization">Customization</a>
      </h3>
      <div className="text-sm-plus mt-5 space-y-4">
        <p>
          Tailux has modular architecture that allows you to customize various
          configuration, including: theme, app, colors, layout, and more.
        </p>
        <p className="inline-code">
          For customizing theme and app constants refer to{" "}
          <code>src/constants</code> and <code>src/configs</code>
        </p>

        <p className="inline-code">
          If you want to customize colors, you can do so by modifying the
          <code>src/constants/colors.constants.js</code> and{" "}
          <code>src/styles/colors.css</code>
        </p>

        <div className="inline-code">
          The <code>this</code> class is used to reference the current color.
          For example, <code>this:primary</code> sets the <code>this</code>{" "}
          color as the primary color. This can then be used for styling with
          Tailwind CSS, such as <code>bg-this dark:bg-this-darker</code>
        </div>
        <Card className="p-4">
          <ThisExample />
        </Card>
        <div className="text-sm">
          <SyntaxHighlighter language="jsx">
            {`import { Button } from "components/ui";
import { useToggle } from "hooks";
import { setThisClass } from "utils/setThisClass";

function ThisExample() {
  const [value, toggle] = useToggle([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]);

  return (
    <div>
      <div
        className={clsx(
          setThisClass(value),
          "size-16 rounded-lg bg-this dark:bg-this-light",
        )}
      />

      <Button className="mt-4" onClick={toggle}>
        Toggle
      </Button>
    </div>
  );
}`}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}

function ThisExample() {
  const [value, toggle] = useToggle([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]);

  return (
    <div>
      <div
        className={clsx(
          setThisClass(value),
          "bg-this dark:bg-this-light size-16 rounded-lg",
        )}
      />

      <Button className="mt-4" onClick={toggle}>
        Toggle
      </Button>
    </div>
  );
}
