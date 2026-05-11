// Import Dependencies
import dayjs from "dayjs";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import PropTypes from "prop-types";

// Local Imports
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

function PersonIcon(props) {
  return (
    <svg
      viewBox="0 0 53 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M25.6338 0.177843C23.7875 0.525695 23.0651 0.699621 22.0483 1.08761C19.8006 1.94386 18.0614 3.24161 16.6164 5.10128C15.5729 6.45255 15.3321 6.8673 14.7568 8.20519C13.4323 11.2957 13.2583 14.4665 14.2618 17.4366C15.1849 20.1659 17.2988 22.6945 20.1083 24.4204C22.4095 25.852 24.0417 26.347 26.4366 26.347C32.1226 26.3737 36.8186 23.524 39.1465 18.6675C40.0162 16.8613 40.2436 15.7509 40.257 13.4096C40.257 10.9479 40.0563 9.90431 39.1599 8.05802C37.2869 4.138 33.7548 1.32843 29.6475 0.498937C28.2561 0.21798 26.2894 0.0574332 25.6338 0.177843Z"
        fill="currentColor"
      />
      <path
        d="M13.2462 29.2136C12.7421 29.4523 12.1584 30.1558 11.7074 31.073C11.0043 32.4927 9.98291 34.6787 9.38597 36.0356C8.28495 38.5232 4.39822 47.1167 3.9074 48.0966C3.65536 48.6117 3.23087 49.5791 2.9523 50.2324C2.67373 50.8857 1.95741 52.4939 1.33394 53.8005C0.00740695 56.6398 -0.138511 57.1173 0.0869988 58.0721C0.498223 59.8059 1.74516 61.1376 3.40332 61.615C4.22577 61.8537 4.70332 61.8412 5.64516 61.5522C7.1574 61.1125 7.4625 60.7607 8.57679 58.2731C9.39924 56.4263 10.3411 54.3533 10.7788 53.3733C10.9513 52.9964 11.4023 51.9788 11.787 51.1119C12.7554 48.9007 13.4452 47.4308 14.0421 46.3L14.5594 45.3201L14.586 78.2743L14.6258 111.241L15.1431 112.234C15.8064 113.515 16.4696 114.181 17.5176 114.633C18.6054 115.098 19.7196 115.123 20.9002 114.696C21.9615 114.319 22.7043 113.628 23.3145 112.497L23.7788 111.618L23.8186 88.7146L23.8451 65.8112H26.6043H29.3502V88.7146V111.731L29.788 112.573C30.5706 114.08 32.0564 114.998 33.7278 114.998C34.5104 114.998 34.8023 114.935 35.5186 114.596C37.4023 113.729 38.1982 112.636 38.5696 110.462C38.6492 109.997 38.7023 97.5217 38.7155 77.4325C38.7155 53.9261 38.7553 45.2321 38.8615 45.4583C38.941 45.6342 39.4053 46.5639 39.8696 47.5313C40.6125 49.0389 41.6737 51.4385 43.2125 55.0694C44.3931 57.8836 44.738 58.6626 45.2023 59.5169C46.091 61.2004 46.8737 61.7155 48.5186 61.7281C49.3676 61.7281 49.6461 61.6653 50.3757 61.3386C52.4717 60.3838 53.4135 58.4993 52.8298 56.3886C52.6308 55.6348 51.7819 53.7125 49.4737 48.662C49.0094 47.6192 48.4523 46.3754 48.2533 45.898C47.8951 45.0185 46.4757 41.8148 45.6666 40.0559C45.4278 39.5408 45.0033 38.5986 44.738 37.9829C41.3155 30.2187 40.9441 29.5277 39.8564 29.1382C39.6043 29.0377 35.3992 29 26.5911 29C14.838 29 13.6574 29.0251 13.2462 29.2136Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DestinationCell({ row }) {
  return (
    <div className="flex items-center space-x-4 ">
      <div className="size-12">
        <img
          className="h-full w-full rounded-lg"
          src={row.original.image}
          alt="destination"
          loading="lazy"
        />
      </div>
      <div>
        <p className="font-medium text-gray-800 dark:text-dark-100">
          {row.original.destination}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-dark-300">
          {row.original.country}
        </p>
      </div>
    </div>
  );
}

export function DepartureCell({ getValue }) {
  const { locale } = useLocaleContext();
  const date = dayjs(+getValue()).locale(locale).format("DD MMM YYYY");

  return (
    <span className="flex items-center space-x-2 ">
      <FaPlaneDeparture className="size-4.5 text-gray-500 dark:text-dark-200" />
      <span>{date}</span>
    </span>
  );
}

export function ReturnCell({ getValue }) {
  const { locale } = useLocaleContext();
  const date = dayjs(+getValue()).locale(locale).format("DD MMM YYYY");

  return (
    <span className="flex items-center space-x-2 ">
      <FaPlaneArrival className="size-4.5 text-gray-500 dark:text-dark-200" />
      <span>{date}</span>
    </span>
  );
}

export function LengthCell({ getValue }) {
  return <span>{getValue()} Night</span>;
}

export function TouristGroupCell({ row }) {
  return (
    <div className="flex items-end space-x-1 text-gray-500 dark:text-dark-200 ">
      <div className="flex space-x-0.5 ">
        {Array(row.original.adults)
          .fill(0)
          .map((_, i) => (
            <PersonIcon key={i} className="h-6 shrink-0" />
          ))}
      </div>
      <div className="flex space-x-0.5 ">
        {Array(row.original.childs)
          .fill(0)
          .map((_, i) => (
            <PersonIcon key={i} className="h-4.5 shrink-0" />
          ))}
      </div>
    </div>
  );
}

export function PriceCell({ getValue }) {
  return (
    <div className="flex items-center space-x-0.5 ">
      <span className="text-gray-500 dark:text-dark-200">$</span>
      <span className="font-medium text-gray-800 dark:text-dark-100">
        {getValue().toFixed(0)}
      </span>
    </div>
  );
}

DestinationCell.propTypes = {
  row: PropTypes.object,
};

DepartureCell.propTypes = {
  getValue: PropTypes.func,
};

ReturnCell.propTypes = {
  getValue: PropTypes.func,
};

LengthCell.propTypes = {
  getValue: PropTypes.func,
};

TouristGroupCell.propTypes = {
  row: PropTypes.object,
};

PriceCell.propTypes = {
  getValue: PropTypes.func,
};
