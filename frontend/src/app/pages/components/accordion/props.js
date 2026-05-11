export const componentProps = [
    {
        componentName: "Accordion",
        description: "A container component for organizing collapsible content panels.",
        props: [
            {
                name: "id",
                type: "string",
                description: "The unique identifier for the accordion instance.",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content, typically `AccordionItem` components, rendered within the accordion.",
            },
            {
                name: "multiple",
                type: "boolean",
                default: false,
                description: "If true, allows multiple accordion items to be expanded simultaneously.",
            },
            {
                name: "value",
                type: "string | string[]",
                description: "The controlled value(s) of the expanded accordion item(s).",
            },
            {
                name: "defaultValue",
                type: "string | string[]",
                description: "The initial expanded item(s) for the uncontrolled accordion.",
            },
            {
                name: "onChange",
                type: "(value: string | string[]) => void",
                description: "Callback function fired when the expanded item(s) change.",
            },
            {
                name: "transitionDuration",
                type: "number",
                description: "The duration of the expand/collapse animation, in milliseconds.",
            },
            {
                name: "loop",
                type: "boolean",
                default: false,
                description: "If true, allows navigation through items to loop from the last item to the first.",
            },
        ],
    },
    {
        componentName: "AccordionItem",
        description: "A container for an individual accordion panel and its associated button.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to render within the accordion item.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the accordion item.",
            },
            {
                name: "value",
                type: "string",
                description: "The unique value associated with this accordion item.",
            },
        ],
    },
    {
        componentName: "AccordionButton",
        description: "A button used to toggle the expansion of an associated accordion panel.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to display within the button.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the button and prevents interaction.",
            },
            {
                name: "component",
                type: "string | React.ElementType",
                description: "The custom component or HTML element to render as the button.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the button.",
            },
        ],
    },
    {
        componentName: "AccordionPanel",
        description: "A collapsible panel that displays additional content when expanded.",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "The content to render within the panel.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the panel.",
            },
            {
                name: "collapseProps",
                type: "object",
                description: "Additional props to pass to the underlying collapse component handling the panel animation.",
            },
        ],
    }
]
