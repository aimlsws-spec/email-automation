export const componentProps = [
    {
        componentName: "Pagination",
        description: "A component for navigating through pages of content.",
        props: [
            {
                name: "total",
                type: "number",
                description: "The total number of pages.",
            },
            {
                name: "value",
                type: "number",
                description: "The current page in controlled mode.",
            },
            {
                name: "defaultValue",
                type: "number",
                description: "The initial page in uncontrolled mode.",
            },
            {
                name: "onChange",
                type: "(value: number) => void",
                description: "Callback function fired when the page changes.",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Disables the entire pagination component.",
            },
            {
                name: "getItemProps",
                type: "(page: number) => object",
                description: "Function to customize props for individual page items.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names for the pagination component.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing CSS class names for specific parts of the component.",
            },
            {
                name: "siblings",
                type: "number",
                default: 1,
                description: "The number of sibling pages to display on each side of the current page.",
            },
            {
                name: "boundaries",
                type: "number",
                default: 1,
                description: "The number of boundary pages to display at the beginning and end of the pagination.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "Custom content to render within the pagination container.",
            },
            {
                name: "onNextPage",
                type: "() => void",
                description: "Callback function fired when navigating to the next page.",
            },
            {
                name: "onPreviousPage",
                type: "() => void",
                description: "Callback function fired when navigating to the previous page.",
            },
            {
                name: "onFirstPage",
                type: "() => void",
                description: "Callback function fired when navigating to the first page.",
            },
            {
                name: "onLastPage",
                type: "() => void",
                description: "Callback function fired when navigating to the last page.",
            },
        ],
    },
    {
        componentName: "PaginationFirst",
        description: "A button for navigating to the first page in the pagination.",
        props: [
            {
                name: "Icon",
                type: "React.ElementType",
                description: "The icon to render inside the button.",
            },
        ],
    },
    {
        componentName: "PaginationLast",
        description: "A button for navigating to the last page in the pagination.",
        props: [
            {
                name: "Icon",
                type: "React.ElementType",
                description: "The icon to render inside the button.",
            },
        ],
    },
    {
        componentName: "PaginationNext",
        description: "A button for navigating to the next page in the pagination.",
        props: [
            {
                name: "Icon",
                type: "React.ElementType",
                description: "The icon to render inside the button.",
            },
        ],
    },
    {
        componentName: "PaginationPrevious",
        description: "A button for navigating to the previous page in the pagination.",
        props: [
            {
                name: "Icon",
                type: "React.ElementType",
                description: "The icon to render inside the button.",
            },
        ],
    }
]
