export const componentProps = [
    {
        componentName: "Select",
        description: "A customizable select dropdown component with support for labels, prefixes, suffixes, and error states.",
        props: [
            {
                name: "label",
                type: "string | React.ReactNode",
                description: "The label displayed above or associated with the select component.",
            },
            {
                name: "prefix",
                type: "React.ReactNode",
                description: "Content to display before the select dropdown, such as an icon.",
            },
            {
                name: "suffix",
                type: "React.ReactNode",
                default: "<ChevronDownIcon className='w-2/3' />",
                description: "Content to display after the select dropdown, typically an icon.",
            },
            {
                name: "description",
                type: "string | React.ReactNode",
                description: "Additional descriptive text displayed below the select component.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing CSS class names for specific parts of the select component.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root element.",
            },
            {
                name: "error",
                type: "string | React.ReactNode",
                description: "Error message or element displayed below the select component when in an error state.",
            },
            {
                name: "multiple",
                type: "boolean",
                description: "If true, allows multiple selections.",
            },
            {
                name: "unstyled",
                type: "boolean",
                description: "If true, removes all default styles, allowing for full customization.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the select dropdown, preventing user interaction.",
            },
            {
                name: "rootProps",
                type: "object",
                description: "Additional props to pass to the root wrapper of the select component.",
            },
            {
                name: "labelProps",
                type: "object",
                description: "Additional props to apply to the label element.",
            },
            {
                name: "id",
                type: "string",
                description: "The ID of the select element, useful for associating labels.",
            },
            {
                name: "data",
                type: "Array<{ label: string; value: any; key: any; disabled: boolean; }>",
                description: "An array of options to populate the dropdown. Each option should include a `label` and `value`.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "Custom content or child nodes to render inside the select dropdown.",
            },
        ],
    }

]
