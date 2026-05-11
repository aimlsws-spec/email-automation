```jsx
// Import Dependencies
import Chart from "react-apexcharts";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

const options = {
  chart: {
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100],
    },
  },
  tooltip: {
    shared: true,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    offsetX: -10,
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
};

export function Area2() {
  const { primaryColorScheme } = useThemeContext();

  const series = [
    {
      name: "PRODUCT B",
      data: [45, 75, 50, 70, 85, 90, 70, 62],
    },
    {
      name: "PRODUCT A",
      data: [30, 16, 27, 30, 55, 60, 48, 43],
    },
  ];

  const chartOptions = {
    ...options,
    colors: [primaryColorScheme[500], "#ffba1a"],
  };

  return (
    <div className="max-w-lg">
      <Chart series={series} type="area" height="350" options={chartOptions} />
    </div>
  );
}
```