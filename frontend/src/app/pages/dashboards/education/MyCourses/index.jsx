// Import Dependencies
import { useRef } from "react";
import { register } from "swiper/element/bundle";

// Local Imports
import { useLocaleContext } from "app/contexts/locale/context";
import { CourseCard } from "./CourseCard";
import { useIsomorphicEffect } from "hooks";

// ----------------------------------------------------------------------

register();

const courses = [
  {
    uid: "1",
    title: "Design For Beginners",
    teacher: "Konnor Guzman",
    level: "advanced",
    progress: 36,
  },
  {
    uid: "2",
    title: "Social Media Marketing",
    teacher: "Eric Fox",
    level: "beginner",
    progress: 60,
  },
  {
    uid: "3",
    title: "Fundamentals of digital marketing",
    teacher: "Travis Fuller",
    level: "intermediate",
    progress: 68,
  },
  {
    uid: "4",
    title: "Figma: Create Design System",
    teacher: "Derrick Simmons",
    level: "advanced",
    progress: 15,
  },
  {
    uid: "5",
    title: "Getting started with Vue",
    teacher: "Katrina West",
    level: "beginner",
    progress: 44,
  },
  {
    uid: "6",
    title: "Object-oriented JavaScript for beginners",
    teacher: "Travis Fuller",
    level: "intermediate",
    progress: 36,
  },
];

export function MyCourses() {
  const carouselRef = useRef();
  const { direction } = useLocaleContext();

  useIsomorphicEffect(() => {
    const params = {
      injectStyles: [
        `
        :host(.my-courses-carousel) .swiper {
          padding-left: var(--margin-x) !important;
          padding-right: var(--margin-x) !important;
        }
        `,
      ],
    };

    Object.assign(carouselRef.current, params);

    carouselRef.current.initialize();
  }, []);

  return (
    <div>
      <p className="transition-content px-(--margin-x) text-base font-medium text-dark-700 dark:text-dark-100">
        My Courses
      </p>
      <div>
        <swiper-container
          init="false"
          class="my-courses-carousel transition-content mx-0 mt-4 flex"
          slides-per-view="auto"
          dir={direction}
          space-between="18"
          ref={carouselRef}
        >
          {courses.map((course) => (
            <swiper-slide key={course.uid} class="flex h-auto w-auto flex-col">
              <CourseCard
                title={course.title}
                teacher={course.teacher}
                level={course.level}
                progress={course.progress}
              />
            </swiper-slide>
          ))}
        </swiper-container>
      </div>
    </div>
  );
}
