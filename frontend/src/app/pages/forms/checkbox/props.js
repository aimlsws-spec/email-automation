export const componentProps = [
    {
        componentName: "Checkbox",
        description: "A customizable checkbox component with support for labels, styles, and states.",
        props: [
            {
                name: "variant",
                type: "'basic' | 'outlined'",
                default: "basic",
                description: "Specifies the style variant of the checkbox.",
            },
            {
                name: "unstyled",
                type: "boolean",
                description: "If true, removes all default styles, allowing for full customization.",
            },
            {
                name: "color",
                type: "string",
                default: "primary",
                description: "Defines the color of the checkbox, based on the theme or custom values.",
            },
            {
                name: "type",
                type: "string",
                default: "checkbox",
                description: "Specifies the input type, which is fixed as 'checkbox' by default.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root element.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing custom class names for specific parts of the checkbox component.",
            },
            {
                name: "label",
                type: "string | React.ReactNode",
                description: "The label text or element displayed alongside the checkbox.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the checkbox, preventing user interaction.",
            },
            {
                name: "indeterminate",
                type: "boolean",
                description: "If true, sets the checkbox to an indeterminate state, typically used for partially selected options.",
            },
            {
                name: "labelProps",
                type: "object",
                description: "Additional props to apply to the label element.",
            },
        ],
    }
]
