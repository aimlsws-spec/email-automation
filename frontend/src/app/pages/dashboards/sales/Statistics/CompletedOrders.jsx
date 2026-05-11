// Import Dependencies
import { useEffect, useState } from "react";

// Local Imports
import { Card, Circlebar } from "components/ui";
import { fetchAdvancedStats } from "services/api";

// ----------------------------------------------------------------------

export function CompletedOrders() {
  const [converted, setConverted] = useState(null);

  useEffect(() => {
    const load = () => fetchAdvancedStats().then((d) => setConverted(d?.converted_leads ?? 0)).catch(() => setConverted(0));
    load();
    const intervalId = setInterval(load, 5000);
    window.addEventListener("dashboard_refresh", load);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, []);

  const val = converted ?? 0;
  // Show as % of a fixed scale (cap at 100) for the circlebar visual
  const pct = Math.min(val, 100);

  return (
    <Card className="flex items-center gap-3 p-4">
      <Circlebar size={12} value={pct} color="primary" strokeWidth={10}>
        <div className="flex items-center justify-center text-xs">{val}</div>
      </Circlebar>
      <div className="text-xs-plus font-medium text-gray-700 [word-break:break-word] dark:text-dark-100">
        Converted Leads
      </div>
    </Card>
  );
}
