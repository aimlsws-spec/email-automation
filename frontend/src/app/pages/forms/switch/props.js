export const componentProps = [
    {
        componentName: "Switch",
        description: "A customizable toggle switch component with support for labels, styles, and states.",
        props: [
            {
                name: "variant",
                type: "'basic' | 'outlined'",
                default: "basic",
                description: "Specifies the style variant of the switch.",
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
                description: "Defines the color of the switch, based on the theme or custom values.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the switch.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing custom class names for specific parts of the switch component.",
            },
            {
                name: "label",
                type: "string | React.ReactNode",
                description: "The label text or element displayed alongside the switch.",
            },
            {
                name: "role",
                type: "string",
                default: "switch",
                description: "Defines the ARIA role of the switch for accessibility.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the switch, preventing user interaction.",
            },
            {
                name: "labelProps",
                type: "object",
                description: "Additional props to apply to the label element.",
            },
        ],
    }

]
