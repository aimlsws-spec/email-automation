export const componentProps = [
    {
        componentName: "Swap",
        description: "A component for swapping between two states with a transition effect.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content or elements to display inside the component. Typically includes two child nodes representing the swap states.",
            },
            {
                name: "component",
                type: "string | React.ElementType",
                default: "div",
                description: "Specifies the root component or HTML element to render.",
            },
            {
                name: "effect",
                type: "'fade' | 'flip' | 'rotate'",
                default: "fade",
                description: "Defines the transition effect to apply when swapping between states.",
            },
            {
                name: "value",
                type: "'on' | 'off'",
                description: "The current value that determines the active state. Typically toggled between two states.",
            },
            {
                name: "defaultValue",
                type: "'on' | 'off'",
                description: "The initial value for the active state when the component is uncontrolled.",
            },
            {
                name: "onChange",
                type: "(value: 'on' | 'off') => void",
                description: "Callback function triggered when the active state changes.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the swap.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables interaction and prevents state changes.",
            },
        ],
    },
    {
        componentName: "SwapOn",
        description: "The content displayed when the 'on' state of the Swap component is active.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to display when the 'on' state is active.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root element.",
            },
            {
                name: "component",
                type: "string | React.ElementType",
                default: "div",
                description: "Specifies the root component or HTML element to render.",
            },
        ],
    },
    {
        componentName: "SwapOff",
        description: "The content displayed when the 'off' state of the Swap component is active.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to display when the 'off' state is active.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root element.",
            },
            {
                name: "component",
                default: "div",
                type: "string | React.ElementType",
                description: "Specifies the root component or HTML element to render.",
            },
        ],
    }
]
