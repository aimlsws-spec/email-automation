// Import Dependencies
import { FaTwitter } from "react-icons/fa";
import { register } from "swiper/element/bundle";

// Local Imports
import { Card } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

register();

export function Tweets() {
  const { direction } = useLocaleContext();

  return (
    <Card>
      <div>
        <swiper-container
          pagination
          pagination-clickable
          slides-per-view="1"
          dir={direction}
          space-between="16"
        >
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <swiper-slide key={i}>
                <div className="p-4 sm:px-5">
                  <div className="flex items-center justify-between">
                    <a
                      href="##"
                      className="font-medium tracking-wide transition-colors hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100"
                    >
                      @twitteraccount
                    </a>

                    <FaTwitter />
                  </div>
                  <p className="mt-3 text-xs-plus">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Doloremque eaque iste libero neque.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 pb-5">
                    <a
                      href="##"
                      className="text-xs-plus text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                    >
                      #PHP
                    </a>
                    <a
                      href="##"
                      className="text-xs-plus text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                    >
                      #ReactJS
                    </a>
                    <a
                      href="##"
                      className="text-xs-plus text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                    >
                      #NextJS
                    </a>
                  </div>
                </div>
              </swiper-slide>
            ))}
        </swiper-container>
      </div>
    </Card>
  );
}
