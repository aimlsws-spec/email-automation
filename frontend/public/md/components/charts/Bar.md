```jsx
// Import Dependencies
import Chart from "react-apexcharts";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

const options = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: "55%",
      borderRadius: 5,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },

  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    fontSize: "14px",
    markers: {
      radius: 12,
    },
  },
};

export function Bar() {
  const { primaryColorScheme } = useThemeContext();

  const series = [
    {
      name: "Net Profit",
      data: [44, 55, 57, 56, 61, 58, 63],
    },
    {
      name: "Revenue",
      data: [76, 85, 101, 98, 87, 105, 91],
    },
  ];

  const categories = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

  const chartOptions = {
    ...options,
    colors: ["#ff9800", primaryColorScheme[500]],
    xaxis: {
      categories,
    },
  };

  return (
    <div className="max-w-lg">
      <Chart series={series} type="bar" height="350" options={chartOptions} />
    </div>
  );
}
```