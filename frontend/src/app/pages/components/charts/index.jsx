// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Area1 } from "./Area1";
import { Area2 } from "./Area2";
import { Bar } from "./Bar";
import { Line } from "./Line";
import { Candlestick } from "./Candlestick";
import { Bubble } from "./Bubble";
import { Column } from "./Column";
import { Radialbar } from "./Radialbar";
import { Radar } from "./Radar";
import { PolarArea } from "./PolarArea";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Apexcharts" },
];

const markdownPath = "components/charts";

const demos = [
  {
    title: "Area Chart Example 1",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> is a modern charting library that helps developers create beautiful and interactive visualizations for web pages with a simple API.",
    Component: Area1,
    markdownName: "Area1",
  },
  {
    title: "Area Chart Example 2",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> supports area charts. An area chart is a type of chart that shows the quantitative variations of data over a period of time or a category.",
    Component: Area2,
    markdownName: "Area2",
  },
  {
    title: "Bar Chart",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> supports bar charts. A bar chart is a type of chart that shows the comparison of metric values across different categories or subgroups of data.",
    Component: Bar,
    markdownName: "Bar",
  },
  {
    title: "Line Chart",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> supports line charts. A line chart is a type of chart that shows the trends and behaviors of data over time or a category.",
    Component: Line,
    markdownName: "Line",
  },
  {
    title: "Candlestick Chart",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> supports candlestick chart. A candlestick chart is a type of chart that describes the price changes of a security, derivative, or currency over a given period.",
    Component: Candlestick,
    markdownName: "Candlestick",
  },
  {
    title: "Bubble Chart",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> supports bubble charts.",
    Component: Bubble,
    markdownName: "Bubble",
  },
  {
    title: "Column Chart",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> supports column chart. A column chart is a type of chart that shows the comparison of metric values across different categories or subgroups of data.",
    Component: Column,
    markdownName: "Column",
  },
  {
    title: "Radialbar Chart",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> supports radialbar charts. A radial bar chart is a type of chart that uses circular shapes to compare different categories.",
    Component: Radialbar,
    markdownName: "Radialbar",
  },
  {
    title: "Radar Chart",
    description:
      "<a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> has a built-in radar chart that you can use by setting the chart.type property to radar. You have to provide your data in the series array as an array of numbers, each representing a value for a variable.",
    Component: Radar,
    markdownName: "Radar",
  },
  {
    title: "Polar Area Chart",
    description:
      "A polar area chart is a type of chart that shows the relative sizes of different categories on a circular grid. <a href='https://apexcharts.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>ApexCharts</a> supports polarcharts",
    Component: PolarArea,
    markdownName: "PolarArea",
  },
];

export default function Charts() {
  return (
    <DemoLayout
      title="Apexcharts"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
