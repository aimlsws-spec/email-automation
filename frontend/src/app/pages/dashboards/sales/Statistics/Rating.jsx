// Import Dependencies
import { useEffect, useState } from "react";

// Local Imports
import { Card, Circlebar } from "components/ui";
import { fetchAdvancedStats } from "services/api";

// ----------------------------------------------------------------------

export function Rating() {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    const load = () => fetchAdvancedStats().then((d) => setRate(d?.sent_rate ?? 0)).catch(() => setRate(0));
    load();
    const intervalId = setInterval(load, 5000);
    window.addEventListener("dashboard_refresh", load);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, []);

  const val = rate ?? 0;

  return (
    <Card className="flex items-center gap-3 p-4">
      <Circlebar size={12} value={val} color="success" isActive strokeWidth={10}>
        <div className="flex items-center justify-center text-xs">{val}%</div>
      </Circlebar>
      <div className="[word-break:break-word] text-xs-plus font-medium text-gray-800 dark:text-dark-100">
        Sent Rate
      </div>
    </Card>
  );
}
