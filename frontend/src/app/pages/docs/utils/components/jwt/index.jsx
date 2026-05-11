import { DemoLayout } from "components/docs/demo/DemoLayout";
import { IsTokenValid } from "./IsTokenValid";
import { SetSession } from "./SetSession";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "JWT" },
];

const demos = [
  {
    title: "isTokenValid",
    description: "Checks if the provided JWT token is valid (not expired).",
    Component: IsTokenValid,
  },
  {
    title: "SetSession",
    description: "Sets or removes the authentication token in local storage and axios headers.",
    Component: SetSession,
  },
];

export default function JWT() {
  return (
    <DemoLayout
      title="JWT"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
