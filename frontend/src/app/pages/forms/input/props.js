export const componentProps = [
    {
        componentName: "Input",
        description: "A versatile input field component with support for labels, prefixes, suffixes, and error handling.",
        props: [
            {
                name: "component",
                type: "string | React.ElementType",
                description: "Custom component or HTML element to render the input field.",
            },
            {
                name: "label",
                type: "string | React.ReactNode",
                description: "The label text or element displayed alongside the input field.",
            },
            {
                name: "prefix",
                type: "string | React.ReactNode",
                description: "An optional prefix element displayed before the input field.",
            },
            {
                name: "suffix",
                type: "string | React.ReactNode",
                description: "An optional suffix element displayed after the input field.",
            },
            {
                name: "description",
                type: "string",
                description: "Additional descriptive text displayed below the input field.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the input element.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing custom class names for specific parts of the input component.",
            },
            {
                name: "error",
                type: "string | React.ReactNode",
                description: "Error message or element displayed when validation fails.",
            },
            {
                name: "unstyled",
                type: "boolean",
                description: "If true, removes all default styles, allowing for full customization.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the input field, preventing user interaction.",
            },
            {
                name: "type",
                type: "string",
                default: "text",
                description: "Specifies the type of input field (e.g., 'text', 'password', 'email').",
            },
            {
                name: "rootProps",
                type: "object",
                description: "Additional props to apply to the root wrapper of the input component.",
            },
            {
                name: "labelProps",
                type: "object",
                description: "Additional props to apply to the label element.",
            },
            {
                name: "id",
                type: "string",
                description: "A unique identifier for the input field, useful for accessibility and forms.",
            },
        ],
    }

]
