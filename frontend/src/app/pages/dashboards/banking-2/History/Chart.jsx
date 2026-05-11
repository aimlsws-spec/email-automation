// Import Dependencies
import ReactApexChart from "react-apexcharts";

// ----------------------------------------------------------------------

const series = [
  {
    name: "Sales",
    data: [28, 45, 35, 50, 32, 55, 23, 60, 28, 66],
  },
  {
    name: "Profit",
    data: [14, 25, 20, 25, 12, 20, 15, 20, 14, 22],
  },
];

const chartConfig = {
  colors: ["#4C4EE7", "#0EA5E9"],
  chart: {
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {},
  legend: {
    show: false,
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
    ],
    labels: {
      hideOverlappingLabels: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  stroke: {
    width: 3,
  },
  markers: {
    size: 5,
    hover: {
      size: 8,
    },
  },
  grid: {
    padding: {
      left: 10,
      right: 0,
      top: -30,
      bottom: -8,
    },
  },
  yaxis: {
    show: false,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
};

export function Chart() {
  return (
    <div className="col-span-12 sm:order-last sm:col-span-6 sm:mt-2 xl:col-span-7">
      <div className="ax-transparent-gridline">
        <ReactApexChart
          height="330"
          type="line"
          options={chartConfig}
          series={series}
        />
      </div>
    </div>
  );
}
