import { Breadcrumbs } from "components/shared/Breadcrumbs";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Shared Components", path: "/docs/shared-components" },
  { title: "Breadcrumbs" },
];

export function Basic() {
  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
    </div>
  );
}
