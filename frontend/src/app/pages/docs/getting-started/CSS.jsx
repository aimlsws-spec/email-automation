import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function CSS() {
  return (
    <section>
      <h3
        id="css"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="CSS"
        data-order="2"
      >
        <a href="#css">CSS</a>
      </h3>
      <div className="mt-5 space-y-4 text-sm-plus">
        <p>
          Tailux leverages the Tailwind CSS framework for styling its
          components, ensuring a modern and consistent design system.
          Additionally, it includes custom CSS classes tailored for specific
          components and third-party libraries.
        </p>
        <p className="inline-code">
          All CSS classes are well-documented and designed for ease of use,
          making it simple to implement and customize styles. The custom styles
          are written using Tailwind <code>@apply</code> utility, providing a
          clean and maintainable approach to styling.
        </p>
        <div className="text-sm">
          <SyntaxHighlighter>
            {`├── styles                     
|   ├── app         
|   |   ├── components             # Styling for core UI components  
|   |   |   └── ...              
|   |   ├── forms                  # Styling for form elements
|   |   |   └── ...              
|   |   ├── vendors                # Styling for third-party library integrations
|   |   |   └── ...              
|   |   └── index.css              # Combines styles from components, forms, and vendors
|   ├── base.css                   # Foundational theme styles
|   ├── index.css                  # Primary CSS entry point 
|   ├── colors.css                 # Theme Colors 
|   ├── layout.css                 # Layout-specific styles (e.g., main-layout, sideblock)
|   └── variants.css               # Styles for color themes and variants`}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}
