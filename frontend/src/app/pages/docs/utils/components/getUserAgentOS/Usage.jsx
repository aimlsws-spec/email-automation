import { getUserAgentOS } from "utils/dom/getUserAgentOS";

const os = getUserAgentOS();

export function Usage() {
  return (
    <div>
      Your Browser: <span className="font-bold">{os}</span>
    </div>
  );
}
