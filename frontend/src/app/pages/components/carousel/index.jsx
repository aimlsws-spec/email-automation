// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { PaginationExample } from "./PaginationExample";
import { Vertical } from "./Vertical";
import { SpaceBetween } from "./SpaceBetween";
import { WithScrollbar } from "./WithScrollbar";
import { ZoomExample } from "./ZoomExample";
import { Fade } from "./Fade";
import { Flip } from "./Flip";
import { Coverflow } from "./Coverflow";
import { Cube } from "./Cube";
import { Card } from "./Card";
import { Creative } from "./Creative";
import { Creative2 } from "./Creative2";
import { ParallaxExample } from "./ParallaxExample";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Carousel" },
];

const markdownPath = "components/carousel";

const demos = [
  {
    title: "Default",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> is the free and most modern mobile touch slider with hardware accelerated transitions and amazing native behavior.",
    Component: Default,
    markdownName: "Default",
  },
  {
    title: "With Pagination",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> comes with all required built-in navigation elements, such as Pagination. You can customize pagination bullets by passing a function that accepts index number of pagination bullet and required element class name.",
    Component: PaginationExample,
    markdownName: "PaginationExample",
  },
  {
    title: "Vertical Carousel",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports vertical carousels. Here’s an example of how to make a vertical carousel using Swiper.",
    Component: Vertical,
    markdownName: "Vertical",
  },
  {
    title: "Space Between Carousel",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> Swiper supports space between slides. Here’s an example of how to add space between slides using Swiper",
    Component: SpaceBetween,
    markdownName: "SpaceBetween",
  },
  {
    title: "With Scrollbar",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports scrollbar. Here’s an example of how to add scrollbar using Swiper.",
    Component: WithScrollbar,
    markdownName: "WithScrollbar",
  },
  {
    title: "Zoom",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports zoom feature. Here’s an example of how to add zoom feature using Swiper",
    Component: ZoomExample,
    markdownName: "ZoomExample",
  },
  {
    title: "Fade",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports fade effect. Here’s an example of how to add fade effect using Swiper",
    Component: Fade,
    markdownName: "Fade",
  },
  {
    title: "Flip",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports flip effect. Here’s an example of how to add flip effect using Swiper",
    Component: Flip,
    markdownName: "Flip",
  },
  {
    title: "Coverflow",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports coverflow effect. Here’s an example of how to add coverflow effect using Swiper",
    Component: Coverflow,
    markdownName: "Coverflow",
  },
  {
    title: "Cube",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports cube effect. Here’s an example of how to add cube effect using Swiper",
    Component: Cube,
    markdownName: "Cube",
  },
  {
    title: "Card Effect",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports card effect. Here’s an example of how to add card effect using Swiper",
    Component: Card,
    markdownName: "Card",
  },
  {
    title: "Creative",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> allows you to create custom effects using transitions and transforms. Here’s an example of how to create a custom effect using Swiper.",
    Component: Creative,
    markdownName: "Creative",
  },
  {
    title: "Creative 2",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> allows you to create custom effects using transitions and transforms. Here’s an example of how to create a custom effect using Swiper.",
    Component: Creative2,
    markdownName: "Creative2",
  },
  {
    title: "Parallax",
    description:
      "<a href='https://swiperjs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Swiper</a> supports parallax effect. Here’s an example of how to add parallax effect using Swiper",
    Component: ParallaxExample,
    markdownName: "ParallaxExample",
  },
];

export default function Carousel() {
  return (
    <DemoLayout
      title="Carousel"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
