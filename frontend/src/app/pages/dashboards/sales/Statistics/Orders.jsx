// Import Dependencies
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";

// Local Imports
import { Card } from "components/ui";
import { fetchDashboard } from "services/api";

// ----------------------------------------------------------------------

const chartConfig = {
  colors: ["#FF9800"],
  chart: { stacked: false, parentHeightOffset: 0, toolbar: { show: false } },
  dataLabels: { enabled: false },
  grid: { padding: { left: 0, right: 0, top: -20, bottom: -10 } },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.1, stops: [20, 100, 100, 100] },
  },
  stroke: { width: 2 },
  tooltip: { shared: true },
  legend: { show: false },
  yaxis: { show: false },
  xaxis: { labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } },
};

export function Orders() {
  const [followupsSent, setFollowupsSent] = useState(null);

  useEffect(() => {
    fetchDashboard().then((d) => setFollowupsSent(d.metrics?.followupsSent ?? 0)).catch(console.error);
  }, []);

  const series = [{ name: "Follow-ups Sent", data: [0, followupsSent ?? 0] }];

  return (
    <Card className="row-span-2 flex flex-col">
      <h2 className="min-w-0 px-4 pt-3 font-medium tracking-wide text-gray-800 dark:text-dark-100 sm:px-5">
        Follow-ups Sent
      </h2>
      <p className="grow px-4 mt-1 text-xl font-semibold text-gray-800 dark:text-dark-100 sm:px-5">
        {followupsSent !== null ? followupsSent : "—"}
      </p>
      <div className="ax-transparent-gridline">
        <Chart type="area" height={140} options={chartConfig} series={series} />
      </div>
    </Card>
  );
}
