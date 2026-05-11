// Import Dependencies
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { Field, Label } from "@headlessui/react";
import clsx from "clsx";

// Local Imports
import { Card } from "components/ui";
import { StyledSwitch } from "components/shared/form/StyledSwitch";
const CodeBox = lazy(() => import("./CodeBox"));

// ----------------------------------------------------------------------

function DemoCard(props) {
  const { Component, title, description, markdownPath, markdownName } = props;

  const [expanded, setExpanded] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setLoading(true);
      const path = `/md/${markdownPath}/${markdownName}.md`;
      const res = await fetch(path);
      const text = await res.text();
      setMarkdown(text);
      setLoading(false);
    };

    if (!markdown && expanded) {
      fetchMarkdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const component = useMemo(() => {
    return <Component />;
  }, []);

  return (
    <Card className="px-4 pb-4 sm:px-5">
      <header className="flex h-14 items-center justify-between space-x-3 py-3 ">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100 lg:text-base">
          {title}
        </h2>
        {markdownName && markdownPath && (
          <Field as="div" className="flex items-center gap-2">
            <Label className="text-xs text-gray-400 dark:text-dark-300">
              Code
            </Label>
            <StyledSwitch
              loading={loading}
              checked={expanded && !!markdown && !loading}
              onChange={setExpanded}
            />
          </Field>
        )}
      </header>

      {description && (
        <div className="inline-code max-w-2xl">{parse(description)}</div>
      )}

      {Component && <div className="mt-5">{component}</div>}

      <div
        className={clsx(
          (!expanded || !markdown || markdown === "") && "hidden",
        )}
      >
        <Suspense>
          <CodeBox markdown={markdown} />
        </Suspense>
      </div>
    </Card>
  );
}

DemoCard.propTypes = {
  Component: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  markdownPath: PropTypes.string,
  markdownName: PropTypes.string,
};

export { DemoCard };
