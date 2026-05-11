export const componentProps = [
    {
        componentName: "Radio",
        description: "A customizable radio button component with support for labels, styles, and states.",
        props: [
            {
                name: "variant",
                type: "'basic' | 'outlined'",
                default: "basic",
                description: "Specifies the style variant of the radio button.",
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
                description: "Defines the color of the radio button, based on the theme or custom values.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the radio element.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing custom class names for specific parts of the radio component.",
            },
            {
                name: "type",
                type: "string",
                default: "radio",
                description: "Specifies the input type, which is fixed as 'radio' by default.",
            },
            {
                name: "label",
                type: "string | React.ReactNode",
                description: "The label text or element displayed alongside the radio button.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the radio button, preventing user interaction.",
            },
            {
                name: "labelProps",
                type: "object",
                description: "Additional props to apply to the label element.",
            },
        ],
    }
]
