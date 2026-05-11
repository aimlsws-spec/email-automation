// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";

// Local Imports
import { Page } from "components/shared/Page";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { DemoCard } from "../DemoCard";
import { ComponentProps } from "./ComponentProps";
import { Returns } from "./Returns";
import { Params } from "./Params";

// ----------------------------------------------------------------------

export function DemoLayout(props) {
  const {
    title = "",
    markdownPath,
    breadcrumbs,
    demos = [],
    componentProps,
    returns,
    params,
    hasPadding = true,
  } = props;
  return (
    <Page title={title}>
      <div
        className={clsx(
          "w-full",
          hasPadding && "transition-content px-(--margin-x) pb-8",
        )}
      >
        <div className="flex items-center space-x-4 py-5 lg:py-6 ">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl truncate">
            {title}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
          {demos.map((demo, i) => (
            <DemoCard
              key={i}
              title={demo.title}
              description={demo.description}
              markdownName={demo.markdownName}
              markdownPath={markdownPath}
              Component={demo.Component}
            />
          ))}
        </div>
        {componentProps && componentProps.length > 0 && (
          <ComponentProps properties={componentProps} />
        )}
        {params && params.length > 0 && <Params params={params} />}
        {returns && returns.length > 0 && <Returns returns={returns} />}
      </div>
    </Page>
  );
}

DemoLayout.propTypes = {
  title: PropTypes.string,
  markdownPath: PropTypes.string,
  breadcrumbs: PropTypes.array,
  demos: PropTypes.array,
  hasPadding: PropTypes.bool,
  componentProps: PropTypes.array,
  returns: PropTypes.array,
  params: PropTypes.array,
};
