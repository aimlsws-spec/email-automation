// Import Dependencies
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { register } from "swiper/element/bundle";
import { useRef } from "react";

// Local Imports
import { CreditCard } from "./CreditCard";
import { useIsomorphicEffect } from "hooks";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

register();

export function Balance() {
  const carouselRef = useRef(null);
  const { direction } = useLocaleContext();

  useIsomorphicEffect(() => {
    const params = {
      injectStyles: [
        `
        :host(.credit-card-carousel) .swiper {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        `,
      ],
    };

    Object.assign(carouselRef.current, params);

    carouselRef.current.initialize();
  }, []);

  return (
    <div className="col-span-12 grid grid-cols-12 rounded-lg bg-linear-to-r from-primary-600 to-primary-500 py-5 sm:py-6">
      <div className="col-span-12 flex flex-col px-4 text-white sm:col-span-6 sm:ltr:pr-0 sm:rtl:pl-0 lg:col-span-4">
        <div className="-mt-1 flex items-center space-x-2 ">
          <h2 className="text-base font-medium tracking-wide">Balance</h2>
        </div>
        <div className="mt-3 grow">
          <p className="text-2xl font-semibold">$6,556.55</p>
          <p className="text-xs text-white/90">+ 3.5%</p>
        </div>
        <div className="mt-4 flex space-x-7 ">
          <div>
            <p className="text-white/90">Income</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-black/20">
                <ArrowUpIcon className="size-4" />
              </div>
              <p className="text-base font-medium">$2,225.22</p>
            </div>
          </div>
          <div>
            <p className="text-white/90">Expense</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-black/20">
                <ArrowDownIcon className="size-4" />
              </div>
              <p className="text-base font-medium">$225.22</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 mt-5 sm:col-span-6 sm:mt-0 lg:col-span-8">
        <swiper-container
          init="false"
          slides-per-view="auto"
          dir={direction}
          space-between="16"
          ref={carouselRef}
          class="credit-card-carousel flex"
        >
          <swiper-slide class="w-auto!">
            <CreditCard
              image="/images/payments/cc-visa-white.svg"
              balance="$1,686.66"
              number="**** **** **** 7946"
            />
          </swiper-slide>
          <swiper-slide class="w-auto!">
            <CreditCard
              image="/images/payments/cc-visa-white.svg"
              balance="$2,5992.00"
              number="**** **** **** 2694"
            />
          </swiper-slide>
          <swiper-slide class="w-auto!">
            <CreditCard
              image="/images/payments/cc-visa-white.svg"
              balance="$3,952.50"
              number="**** **** **** 3298"
            />
          </swiper-slide>
          <swiper-slide class="w-auto!">
            <CreditCard
              image="/images/payments/cc-visa-white.svg"
              balance="$3,206.11"
              number="**** **** **** 3812"
            />
          </swiper-slide>
        </swiper-container>
      </div>
    </div>
  );
}
