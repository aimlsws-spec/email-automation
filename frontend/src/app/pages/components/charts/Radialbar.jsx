// Import Dependencies
import Chart from "react-apexcharts";

// ----------------------------------------------------------------------

const options = {
  colors: ["#4ade80", "#f43f5e", "#a855f7"],
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "35%",
      },
      track: {
        margin: 15,
      },
      dataLabels: {
        name: {
          fontSize: "22px",
        },
        value: {
          fontSize: "16px",
        },
        total: {
          show: true,
          label: "Total",
          formatter: function (w) {
            return w.config.series.reduce((s, v) => s + v);
          },
        },
      },
    },
  },
  stroke: {
    lineCap: "round",
  },
};

export function Radialbar() {
  const series = [44, 55, 67];

  const labels = ["Apples", "Oranges", "Bananas"];

  const chartOptions = {
    ...options,
    labels,
  };

  return (
    <div className="max-w-lg">
      <Chart
        series={series}
        type="radialBar"
        height="350"
        options={chartOptions}
      />
    </div>
  );
}
