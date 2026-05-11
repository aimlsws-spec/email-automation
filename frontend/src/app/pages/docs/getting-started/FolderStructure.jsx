import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function FolderStructure() {
  return (
    <section>
      <h3
        id="folder-structure"
        className="mt-10 scroll-mt-20 border-b border-gray-200 pb-1 text-lg font-semibold dark:border-dark-500 lg:text-2xl"
        data-heading="Folder Structure"
        data-order="2"
      >
        <a href="#folder-structure">Folder Structure</a>
      </h3>
      <div className="mt-5 text-sm-plus">
        <p>
          Tailux offers a clean and organized folder structure, making it easy
          to locate and refactor components and sections for your project. Its
          design supports seamless scalability for projects of any size.
        </p>
        <div className="mt-5 text-sm">
          <SyntaxHighlighter>
            {`├── public                             # Static assets
|   ├── images                         # Image assets 
|   └── md                             # Markdown files
├── src                                # Main Source Folder
|   ├── app                            # Core Application Folder
|   |   ├── contexts                   # Application context providers
|   |   |   └── ...              
|   |   ├── layouts                    # Application layout components  
|   |   |   └── ...              
|   |   ├── navigation                 # Application navigation tree  
|   |   |   └── ...              
|   |   ├── pages                      # APPLICATION PAGES  
|   |   |   └── ...              
|   |   └── router                     # Application routes  
|   |       └── ...              
|   ├── assets                         # Static Importable Assets  
|   |   └── ...             
|   ├── components                     # App UI Components
|   |   ├── docs                       # Documentation components
|   |   |   └── ...              
|   |   ├── shared                     # Shared Components
|   |   |   └── ...              
|   |   ├── template                   # Application parts (e.g., search, notifications)
|   |   |   └── ...              
|   |   └── ui                         # Core UI components  
|   |       └── ...              
|   ├── configs                        # Application configurations
|   |   ├── auth.config.js             # Authentication configuration
|   |   ├── breakpoints.config.js      # Responsive breakpoints
|   |   └── theme.config.js            # Theme configuration
|   ├── constants                      # Application constants
|   |   ├── app.constant.js            # General application constants
|   |   ├── colors.constant.js         # Color constants 
|   |   └── countries.config.js        # Countries
|   ├── hooks                          # App Custom hooks
|   |   └── ...              
|   ├── i18n                           # Internationalization
|   |   ├── locales                    # Locale constants 
|   |   |   └── ...              
|   |   ├── config.constant.js         # i18n configuration
|   |   └── langs.js                   # Language imports (e.g., datepicker, dayjs, flags)  
|   ├── middleware                     # Middleware for application routing
|   |   ├── AuthGuard.jsx              # Authentication guard for route
|   |   └── GhostGuard.jsx             # Guard guard for route
|   ├── styles                         # Application Styles
|   |   ├── app         
|   |   |   ├── components             # Styling for core UI components  
|   |   |   |   └── ...              
|   |   |   ├── forms                  # Styling for form elements
|   |   |   |   └── ...              
|   |   |   ├── vendors                # Styling for third-party library integrations
|   |   |   |   └── ...              
|   |   |   └── index.css              # Combines styles from components, forms, and vendors
|   |   ├── base.css                   # Foundational theme styles
|   |   ├── index.css                  # Primary CSS entry point 
|   |   ├── colors.css                 # Theme Colors 
|   |   ├── layout.css                 # Layout-specific styles (e.g., main-layout, sideblock)
|   |   └── variants.css               # Styles for color themes and variants
|   ├── utils                          # Utility Functions
|   |   └── ...             
|   ├── App.jsx                        # Application entry point
|   └── main.jsx                       # React entry point
├── .gitignore                         # Git ignore file
├── .prettierignore                    # Prettier ignore file
├── eslint.config.js                   # ESLint configuration
├── index.html                         # HTML entry point
├── jsconfig.json                      # JavaScript configuration
├── package.json                       # NPM package configuration  
├── prettier.config.js                 # Prettier configuration
├── README.md                          # Readme file
├── vite.config.js                     # Vite configuration
└── yarn.lock                          # Yarn lock file
`}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}
