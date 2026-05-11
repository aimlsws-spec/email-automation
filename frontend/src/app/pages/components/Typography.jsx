// Local Imports
import { Card } from "components/ui";
import { Page } from "components/shared/Page";
import { Breadcrumbs } from "components/shared/Breadcrumbs";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Typography" },
];

const Typography = () => {
  return (
    <Page title="Typography">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 ">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            Typography
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          <Card className="p-4 sm:px-5">
            <div className="space-y-4">
              <h1 className="text-3xl">Heading H1</h1>
              <h2 className="text-2xl">Heading H2</h2>
              <h3 className="text-xl">Heading H3</h3>
              <h4 className="text-lg">Heading H4</h4>
              <h5 className="text-base">Heading H5</h5>
              <h6 className="text-sm">Heading H6</h6>
            </div>
          </Card>
          <Card className="p-4 sm:px-5">
            <div className="space-y-4">
              <h1 className="text-3xl font-light">Heading H1</h1>
              <h2 className="text-2xl font-light">Heading H2</h2>
              <h3 className="text-xl font-light">Heading H3</h3>
              <h4 className="text-lg font-light">Heading H4</h4>
              <h5 className="text-base font-light">Heading H5</h5>
              <h6 className="text-sm font-light">Heading H6</h6>
            </div>
          </Card>
          <Card className="p-4 sm:px-5">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold">Heading H1</h1>
              <h2 className="text-2xl font-semibold">Heading H2</h2>
              <h3 className="text-xl font-semibold">Heading H3</h3>
              <h4 className="text-lg font-semibold">Heading H4</h4>
              <h5 className="text-base font-semibold">Heading H5</h5>
              <h6 className="text-sm font-semibold">Heading H6</h6>
            </div>
          </Card>
          <Card className="p-4 sm:px-5">
            <div className="mt-5 space-y-4">
              <h1 className="text-3xl text-primary-600 dark:text-primary-400">
                Heading H1
              </h1>
              <h2 className="text-2xl text-secondary dark:text-secondary-lighter">
                Heading H2
              </h2>
              <h3 className="text-xl text-info dark:text-info-lighter">
                Heading H3
              </h3>
              <h4 className="text-lg text-success dark:text-success-lighter">
                Heading H4
              </h4>
              <h5 className="text-base text-warning dark:text-warning-lighter">
                Heading H5
              </h5>
              <h6 className="text-sm text-error dark:text-error-lighter">
                Heading H6
              </h6>
            </div>
          </Card>
          <Card className="p-4 sm:px-5 lg:col-span-2">
            <div className="space-y-6">
              <h1 className="text-8xl">Display 1</h1>
              <h1 className="text-7xl">Display 2</h1>
              <h1 className="text-6xl">Display 3</h1>
              <h1 className="text-5xl">Display 4</h1>
              <h1 className="text-4xl">Display 5</h1>
            </div>
          </Card>
          <Card className="p-4 sm:px-5">
            <div className="space-y-3">
              <p>
                <span className="bg-linear-to-r from-sky-400 to-blue-600 bg-clip-text text-lg font-semibold text-transparent">
                  The quick brown fox jumps over the lazy dog.
                </span>
              </p>
              <p>
                <span className="bg-linear-to-r from-green-400 to-fuchsia-400 bg-clip-text text-lg font-semibold text-transparent">
                  The quick brown fox jumps over the lazy dog.
                </span>
              </p>
              <p>
                <span className="bg-linear-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent">
                  The quick brown fox jumps over the lazy dog.
                </span>
              </p>
              <p>
                <span className="bg-linear-to-r from-amber-400 to-orange-600 bg-clip-text text-lg font-semibold text-transparent">
                  The quick brown fox jumps over the lazy dog.
                </span>
              </p>
            </div>
          </Card>
          <Card className="p-4 sm:px-5">
            <div className="space-y-3">
              <p className="text-lg underline">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-lg overline">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-lg line-through">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-lg no-underline">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </Card>
          <Card className="p-4 sm:px-5">
            <div className="mt-5">
              <p className="text-sm leading-6">
                I’m Derek, an astro-engineer based in Tattooine. I like to build
                X-Wings at
                <a
                  href="https://tailux.piniastudio.com/"
                  className="font-semibold underline decoration-info decoration-2"
                >
                  My Company, Inc
                </a>
                . Outside of work, I like to
                <a
                  href="https://tailux.piniastudio.com/"
                  className="font-semibold underline decoration-secondary decoration-2"
                >
                  watch pod-racing
                </a>
                and have
                <a
                  href="https://tailux.piniastudio.com/"
                  className="decoration-primary font-semibold underline decoration-2"
                >
                  light-saber
                </a>
                fights.
              </p>
            </div>
          </Card>

          <Card className="p-4 sm:px-5">
            <div className="mt-5">
              <p className="text-sm leading-6">
                I’m Derek, an astro-engineer based in
                <a
                  href="https://tailux.piniastudio.com/"
                  className="font-semibold underline decoration-info decoration-wavy decoration-2"
                >
                  Tattooine
                </a>
                . I like to build X-Wings at
                <a
                  href="https://tailux.piniastudio.com/"
                  className="font-semibold underline decoration-info decoration-double decoration-2"
                >
                  My Company, Inc
                </a>
                . Outside of work, I like to
                <a
                  href="https://tailux.piniastudio.com/"
                  className="font-semibold underline decoration-secondary decoration-dotted decoration-2"
                >
                  watch pod-racing
                </a>
                and have
                <a
                  href="https://tailux.piniastudio.com/"
                  className="decoration-primary font-semibold underline decoration-dashed decoration-2"
                >
                  light-saber
                </a>
                fights.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default Typography;
