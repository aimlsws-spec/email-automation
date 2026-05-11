// Import Dependencies
import { useRef } from "react";
import { register } from "swiper/element/bundle";

// Local Imports
import { useLocaleContext } from "app/contexts/locale/context";
import { useIsomorphicEffect } from "hooks";
import { Box } from "components/ui";

// ----------------------------------------------------------------------

register();

export function BankingCard() {
  const { direction } = useLocaleContext();
  const carouselRef = useRef(null);

  useIsomorphicEffect(() => {
    const params = {
      injectStyles: [
        `
        :host(.banking-card-carousel) .swiper {
          padding-left: .75rem;
          padding-right: .75rem;
        }
        `,
      ],
    };

    Object.assign(carouselRef.current, params);

    carouselRef.current.initialize();
  }, []);

  return (
    <div className="mt-3">
      <h2 className="line-clamp-1 px-3 text-xs-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
        Banking cards
      </h2>
      <swiper-container
        class="banking-card-carousel flex mt-3"
        init="false"
        ref={carouselRef}
        slides-per-view="auto"
        dir={direction}
        space-between="16"
      >
        <swiper-slide class="w-48">
          <Box className="relative flex h-28 w-48 shrink-0 flex-col overflow-hidden rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 p-3">
            <div className="grow">
              <img
                className="h-3"
                src="/images/payments/cc-visa-white.svg"
                alt="visa"
              />
            </div>
            <div className="text-white">
              <p className="text-lg font-semibold tracking-wide">$2,139.22</p>
              <p className="mt-1 text-xs font-medium">**** **** **** 8945</p>
            </div>
            <div className="mask is-reuleaux-triangle pointer-events-none absolute right-0 top-0 -m-3 size-16 bg-white/20" />
          </Box>
        </swiper-slide>
        <swiper-slide class="w-48">
          <Box className="relative flex h-28 w-48 shrink-0 flex-col overflow-hidden rounded-xl bg-linear-to-br from-pink-500 to-rose-500 p-3">
            <div className="grow">
              <img
                className="h-3"
                src="/images/payments/cc-visa-white.svg"
                alt="visa"
              />
            </div>
            <div className="text-white">
              <p className="text-lg font-semibold tracking-wide">$2,139.22</p>
              <p className="mt-1 text-xs font-medium">**** **** **** 8945</p>
            </div>
            <div className="mask is-diamond absolute bottom-0 right-0 -m-3 size-16 bg-white/20" />{" "}
          </Box>
        </swiper-slide>
        <swiper-slide class="w-48">
          <Box className="relative flex h-28 w-48 shrink-0 flex-col overflow-hidden rounded-xl bg-linear-to-br from-info to-info-darker p-3">
            <div className="grow">
              <img
                className="h-3"
                src="/images/payments/cc-visa-white.svg"
                alt="visa"
              />
            </div>
            <div className="text-white">
              <p className="text-lg font-semibold tracking-wide">$2,139.22</p>
              <p className="mt-1 text-xs font-medium">**** **** **** 8945</p>
            </div>
            <div className="mask is-hexagon-2 absolute right-0 top-0 -m-3 size-16 bg-white/20" />
          </Box>
        </swiper-slide>
      </swiper-container>
    </div>
  );
}
