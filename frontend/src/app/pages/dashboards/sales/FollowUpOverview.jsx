// Import Dependencies
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";

// Local Imports
import { Card } from "components/ui";
import { fetchAnalyticsOverview } from "services/api";

// ----------------------------------------------------------------------

const labels = ["Sent", "Pending", "Failed", "Replied"];
const colors = ["#4467EF", "#f59e0b", "#ef4444", "#22c55e"];

const baseConfig = {
  colors,
  labels,
  chart: { 
    parentHeightOffset: 0, 
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "75%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total Leads",
            fontSize: "10px",
            fontWeight: "bold",
            color: "#6b7280",
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
          },
          value: {
            fontSize: "24px",
            fontWeight: "900",
            color: "#1e293b",
            offsetY: 4
          }
        },
      },
    },
  },
  legend: {
    position: "bottom",
    fontSize: "11px",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    markers: { size: 8, shape: "circle" },
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  tooltip: { y: { formatter: (val) => `${val} leads` } },
  stroke: { width: 3, colors: ["#fff"] },
};

export function FollowUpOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetchAnalyticsOverview()
        .then((d) => setData(d.leadStatus || null))
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    };
    load();
    const intervalId = setInterval(load, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const series = data
    ? [
        data.sent    || 0,
        data.pending || 0,
        data.failed  || 0,
        data.replied || 0,
      ]
    : [0, 0, 0, 0];

  return (
    <Card className="pb-6 border border-gray-100 dark:border-dark-700">
      <div className="flex h-14 min-w-0 items-center px-4 py-3 sm:px-6 border-b border-gray-100 dark:border-dark-800">
        <h2 className="min-w-0 font-bold tracking-tight text-gray-800 dark:text-dark-100 uppercase text-xs">
          Lead Status Overview
        </h2>
      </div>
      <div className="ax-transparent-gridline px-2 mt-4 relative">
        <Chart type="donut" height="300" series={series} options={baseConfig} />
        {loading && !data && (
           <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-dark-900/50">
              <p className="text-xs font-bold text-gray-400">Syncing...</p>
           </div>
        )}
      </div>
    </Card>
  );
}
