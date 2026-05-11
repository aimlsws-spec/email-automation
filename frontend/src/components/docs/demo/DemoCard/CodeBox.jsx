// Import Dependencies
import Markdown from "react-markdown";
import PropTypes from "prop-types";
import { CheckIcon } from "@heroicons/react/20/solid";

// Local Imports
import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";
import { Button, CopyButton } from "components/ui";

// ----------------------------------------------------------------------

function Highlight({ children }) {
  return (
    <SyntaxHighlighter className="max-h-[32rem] [direction:ltr]" language="jsx">
      {children}
    </SyntaxHighlighter>
  );
}

function CodeBox({ markdown }) {
  return (
    <div className="group relative">
      <CopyButton value={markdown?.replace(/```jsx|```/g, "") || ""}>
        {({ copied, copy }) => (
          <Button
            onClick={copy}
            className="absolute right-0 top-0 mx-6 my-3 flex gap-1 px-2 py-1 text-xs opacity-0 group-hover:opacity-100"
          >
            {copied && <CheckIcon className="size-3.5 text-success-light" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>
        )}
      </CopyButton>
      <div className="mt-6">
        <Markdown
          components={{
            code: Highlight,
          }}
        >
          {markdown}
        </Markdown>
      </div>
    </div>
  );
}

Highlight.propTypes = {
  children: PropTypes.node,
};

CodeBox.propTypes = {
  markdown: PropTypes.string,
};

export default CodeBox;
