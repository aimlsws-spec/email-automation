import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Internationalization() {
  return (
    <section>
      <h3
        id="internationalization"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="Internationalization"
        data-order="2"
      >
        <a href="#internationalization">Internationalization</a>
      </h3>
      <div className="mt-5 space-y-4 text-sm-plus">
        <p className="inline-code">
          Tailux supports multilingual applications and allows customization of
          internationalization through the <code>src/i18n/config.js</code> file.
          Translation files can be added or updated in the{" "}
          <code>src/i18n/locales/</code> directory. Additionally, the
          <code>src/i18n/langs.js</code> file should be modified to add or
          remove configurations for datepickers, date formats, flags, and
          translation files.
        </p>
        <div className="text-sm">
          <SyntaxHighlighter language="javascript">
            {`export const locales = {
    en: {
        label: "English",
        dayjs: () => import('dayjs/locale/en'),
        flatpickr: null,
        i18n: () => import("./locales/en/translations.json"),
        flag: 'united-kingdom'
    },
    // ...
}`}
          </SyntaxHighlighter>
        </div>
        <p className="inline-code">
          To switch between languages, use the <code>useLocaleContext</code>{" "}
          hook in your components. Also you can use the{" "}
          <code>useTranslation</code> hook to access the translation strings.
        </p>
      </div>
    </section>
  );
}
