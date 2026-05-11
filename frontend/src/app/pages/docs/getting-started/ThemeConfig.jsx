import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function ThemeConfig() {
  return (
    <section>
      <h3
        id="theme-config"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="Theme Config"
        data-order="2"
      >
        <a href="#theme-config">Theme Config</a>
      </h3>
      <div className="mt-5 space-y-4 text-sm-plus">
        <div>
          <p className="inline-code">
            The <code>src/configs/theme.config.js</code> file allows you to
            customize various aspects of the theme configuration, including:
          </p>
          <ul className="mt-5 list-outside list-disc space-y-5">
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>themeMode</strong>
              <div className="mt-2">
                Control the theme mode (e.g., light, dark, or system).
              </div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>isMonochrome</strong>
              <div className="mt-2">Enable or disable a monochrome mode</div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>themeLayout</strong>
              <div className="mt-2">
                Choose the layout type (e.g., main-layout or sideblock).
              </div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>cardSkin</strong>
              <div className="mt-2">
                Set the card appearance (e.g., bordered or shadow).
              </div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>darkColorScheme</strong>
              <div className="mt-2">Define the color scheme for dark mode.</div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>lightColorScheme</strong>
              <div className="mt-2">
                Define the color scheme for light mode.
              </div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>primaryColorScheme</strong>
              <div className="mt-2">Select the primary color palette. </div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>defaultLang</strong>
              <div className="mt-2">Specify the default language.</div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>fallbackLang</strong>
              <div className="mt-2"> Set a fallback language.</div>
            </li>
            <li className="ltr:ml-4 rtl:mr-4">
              <strong>notification</strong>
              <div className="mt-2">
                Adjust notification settings, such as visibility and position.
              </div>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <SyntaxHighlighter language="js">
            {`import { colors } from "constants/colors.constant";  

const DEFAULT_DARK_COLOR = "cinder";  
// Options: "cinder", "navy", "mirage", "black", "mint"  

const DEFAULT_LIGHT_COLOR = "slate";  
// Options: "slate", "gray", "neutral"  

const DEFAULT_PRIMARY_COLOR = "blue";  
// Options: "indigo", "blue", "green", "amber", "purple", "rose"  

// Default theme configuration  
export const defaultTheme = {  
    themeMode: "system",  
    // Options: "light", "dark", "system"  
    isMonochrome: false,  
    // If true, the theme uses a monochrome color palette  

    themeLayout: "main-layout",  
    // Options: "main-layout", "sideblock"  
    cardSkin: "bordered",  
    // Options: "bordered", "shadow"  

    // Dark mode color scheme  
    darkColorScheme: {  
        name: DEFAULT_DARK_COLOR,  
        ...colors[DEFAULT_DARK_COLOR],  
    },  

    // Light mode color scheme  
    lightColorScheme: {  
        name: DEFAULT_LIGHT_COLOR,  
        ...colors[DEFAULT_LIGHT_COLOR],  
    },  

    // Primary color scheme  
    primaryColorScheme: {  
        name: DEFAULT_PRIMARY_COLOR,  
        ...colors[DEFAULT_PRIMARY_COLOR],  
    },  

    // Language settings  
    defaultLang: "en",
    fallbackLang: "en", 

    // Notification settings  
    notification: {  
        isExpanded: false,  
        position: "bottom-right",  
        visibleToasts: 4,  
    },  
};`}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}
