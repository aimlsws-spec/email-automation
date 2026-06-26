// Import Dependencies
import Chart from "react-apexcharts";
import {
  Menu, MenuButton, MenuItem, MenuItems, Radio, RadioGroup, Transition,
} from "@headlessui/react";
import { clsx } from "clsx";
import { Fragment, useEffect, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";

// Local Imports
import { Button, Card } from "components/ui";
import { fetchAnalyticsActivity } from "services/api";

// ----------------------------------------------------------------------

const SERIES_COLORS = ["#4C4EE7", "#10B981", "#F59E0B"]; // Sent=Blue, Replies=Green, Follow-ups=Orange

const chartConfig = {
  colors: SERIES_COLORS,
  chart: {
    type: "bar",
    toolbar: { show: false },
    sparkline: { enabled: false },
    animations: { enabled: true, speed: 400 },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "60%",
      borderRadius: 5,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: { enabled: false },
  // stroke.colors must be "transparent" for bar charts — this hides the bar
  // border strokes. Do NOT set this to a real color or the bars look double-bordered.
  stroke: { show: true, width: 2, colors: ["transparent"] },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "right",
    markers: { radius: 8 },
    itemMargin: { horizontal: 10, vertical: 5 },
    labels: { colors: "#64748b" },
  },
  xaxis: {
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#94a3b8", fontSize: "12px" } },
  },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 4,
    yaxis: { lines: { show: true } },
    padding: { left: 20, right: 20, top: 0, bottom: 0 },
  },
  yaxis: {
    labels: { style: { colors: "#94a3b8" } },
    min: 0,
    forceNiceScale: true,
  },
  tooltip: {
    theme: "light",
    custom: function ({ series, dataPointIndex, w }) {
      const date = w.globals.labels[dataPointIndex];
      const [sent, replies, followups] = SERIES_COLORS;
      return `
        <div style="background:#fff;padding:12px;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 4px 6px -1px rgb(0 0 0/.1);min-width:160px">
          <div style="font-weight:700;border-bottom:1px solid #f1f5f9;padding-bottom:4px;margin-bottom:8px;color:#1e293b">${date}</div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span style="color:${sent};font-weight:600">📤 Sent</span>
            <span>${series[0][dataPointIndex] || 0}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span style="color:${replies};font-weight:600">💬 Replies</span>
            <span>${series[1][dataPointIndex] || 0}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px">
            <span style="color:${followups};font-weight:600">🔁 Follow-ups</span>
            <span>${series[2][dataPointIndex] || 0}</span>
          </div>
        </div>
      `;
    },
  },
};

const RANGES = ["Daily", "Monthly", "Yearly"];

export function SalesReport() {
  const [range, setRange]       = useState("daily");
  const [activity, setActivity] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    const load = () =>
      fetchAnalyticsActivity(range)
        .then((data) => { setActivity(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => { setActivity([]); setLoading(false); });
    load();
    const intervalId = setInterval(load, 5000);
    window.addEventListener("dashboard_refresh", load);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, [range]);

  // Format date for x-axis label based on the active range
  const formatXDate = (dateStr) => {
    if (range === 'yearly') return dateStr; // already '2026', '2025', etc.
    const parts = dateStr.split('-').map(Number);
    if (range === 'monthly') {
      // '2026-05' → 'May 26'
      const d = new Date(parts[0], parts[1] - 1, 1);
      return d.toLocaleDateString('default', { month: 'short', year: '2-digit' });
    }
    // daily: '2026-05-13' → '13 May'
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  const categories = activity.map((r) => formatXDate(r.date));
  const series = [
    { name: "Emails Sent", data: activity.map((r) => Number(r.sent || 0)) },
    { name: "Replies",     data: activity.map((r) => Number(r.replies || 0)) },
    { name: "Follow-ups",   data: activity.map((r) => Number(r.followups || 0)) },
  ];
  const options = { ...chartConfig, xaxis: { ...chartConfig.xaxis, categories } };

  return (
    <Card>
      <div className="mt-3 flex flex-col justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-5">
        <div className="flex flex-1 items-center justify-between space-x-2 sm:flex-initial">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-dark-100">
            Email Activity Overview
          </h2>
          <ActionMenu />
        </div>
        <RadioGroup value={range} onChange={setRange} className="flex flex-wrap -space-x-px">
          {RANGES.map((r) => (
            <Radio
              key={r}
              as={Button}
              unstyled
              value={r.toLowerCase()}
              className={({ checked }) =>
                clsx(
                  "h-8 border border-gray-300 px-3 text-xs dark:border-dark-450 first:ltr:rounded-l-lg last:ltr:rounded-r-lg",
                  checked
                    ? "bg-primary-500 text-white"
                    : "text-gray-800 dark:text-dark-100"
                )
              }
            >
              {r}
            </Radio>
          ))}
        </RadioGroup>
      </div>
      <div className="ax-transparent-gridline pr-2">
        {loading ? (
          <div className="flex h-[260px] items-center justify-center">
            <p className="text-sm text-gray-400">Loading activity…</p>
          </div>
        ) : activity.length === 0 || activity.every(r => r.sent === 0 && r.replies === 0 && r.followups === 0) ? (
          <div className="flex h-[260px] items-center justify-center">
            <p className="text-sm text-gray-400">No activity recorded for this period</p>
          </div>
        ) : (
          <Chart
            key={range}
            type="bar"
            height="260"
            options={options}
            series={series}
          />
        )}
      </div>
    </Card>
  );
}

function ActionMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5">
      <MenuButton as={Button} variant="flat" isIcon className="size-8 rounded-full">
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out" enterFrom="opacity-0 translate-y-2" enterTo="opacity-100 translate-y-0"
        leave="transition ease-in" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg outline-hidden dark:border-dark-500 dark:bg-dark-700 ltr:right-0">
          <MenuItem>
            {({ focus }) => (
              <button className={clsx("flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors", focus && "bg-gray-100 dark:bg-dark-600")}>
                Export CSV
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
