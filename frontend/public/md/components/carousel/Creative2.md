```jsx
// Import Dependencies
import { register } from "swiper/element/bundle";
import { useRef } from "react";

// Local Imports
import { randomId } from "utils/randomId";
import { useLocaleContext } from "app/contexts/locale/context";
import { useIsomorphicEffect } from "hooks";

// ----------------------------------------------------------------------

register();

const images = [
  { id: randomId(), img: "/images/objects/object-11.jpg" },
  { id: randomId(), img: "/images/objects/object-3.jpg" },
  { id: randomId(), img: "/images/objects/object-2.jpg" },
  { id: randomId(), img: "/images/objects/object-9.jpg" },
];

export function Creative2() {
  const { direction } = useLocaleContext();
  const carouselRef = useRef();

  useIsomorphicEffect(() => {
    const carouselParams = {
      effect: "creative",
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ["-20%", 0, -1],
        },
        next: {
          translate: ["100%", 0, 0],
        },
      },
    };

    Object.assign(carouselRef.current, carouselParams);

    setTimeout(() => {
      carouselRef.current.initialize();
    });
  }, []);

  return (
    <div className="max-w-md">
      <swiper-container
        navigation="true"
        dir={direction}
        ref={carouselRef}
        init="false"
        class="rounded-lg overflow-hidden"
      >
        {images.map(({ img, id }) => (
          <swiper-slide key={id}>
            <img
              className="h-full w-full rounded-lg object-cover"
              src={img}
              alt="object"
              loading="lazy"
            />
          </swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
}
```