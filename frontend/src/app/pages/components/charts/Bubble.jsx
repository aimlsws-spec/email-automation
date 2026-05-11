// Import Dependencies
import Chart from "react-apexcharts";

// ----------------------------------------------------------------------

const options = {
  chart: {
    zoom: {
      enabled: true,
      type: "xy",
    },
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    tickAmount: 10,
    labels: {
      formatter: function (val) {
        return parseFloat(val).toFixed(1);
      },
    },
  },
  yaxis: {
    tickAmount: 7,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "left",
    fontSize: "14px",
  },
};

export function Bubble() {
  const series = [
    {
      name: "SAMPLE A",
      data: [
        [16.4, 5.4],
        [21.7, 2],
        [27.1, 2.3],
        [16.4, 0],
        [13.6, 3.7],
        [10.9, 5.2],
        [16.4, 6.5],
        [10.9, 0],
        [24.5, 7.1],
        [10.9, 0],
        [8.1, 4.7],
      ],
    },
    {
      name: "SAMPLE B",
      data: [
        [36.4, 13.4],
        [1.6, 10],
        [9.9, 2],
        [7.1, 15],
        [1.4, 0],
        [3.6, 13.7],
        [1.9, 15.2],
        [6.4, 16.5],
        [0.9, 10],
        [4.5, 17.1],
        [10.9, 10],
      ],
    },
    {
      name: "SAMPLE C",
      data: [
        [21.7, 3],
        [32.6, 3],
        [27.1, 4],
        [29.6, 6],
        [31.6, 8],
        [21.6, 5],
        [20.9, 4],
        [22.4, 0],
        [32.6, 10.3],
        [29.7, 20.8],
        [24.5, 0.8],
      ],
    },
  ];

  return (
    <div className="max-w-xl">
      <Chart series={series} type="scatter" height="350" options={options} />
    </div>
  );
}
