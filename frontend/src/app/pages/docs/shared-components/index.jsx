// Import Dependencies
import { Routes, Route, Navigate } from "react-router";

// Local Imports
import { Page } from "components/shared/Page";
import { routes } from "./routes";
import { DocsNavigation } from "components/template/DocsNavigation";

// ----------------------------------------------------------------------

export default function SharedComponents() {
  return (
    <Page title="Shared Components">
      <div className="transition-content grid grid-cols-4 gap-8 px-(--margin-x) pb-16 2xl:gap-16">
        <DocsNavigation
          prefix="/docs/shared-components"
          items={routes}
          title="Shared Components"
        />

        <div className="col-span-4 lg:col-span-3">
          <Routes>
            <Route
              index
              element={<Navigate to={routes[0].path} replace={true} />}
            />
            {routes.map(({ Component, path }) => (
              <Route key={path} path={path} Component={Component} />
            ))}
          </Routes>
        </div>
      </div>
    </Page>
  );
}
