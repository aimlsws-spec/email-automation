export const componentProps = [
    {
        componentName: "Textarea",
        description: "A customizable textarea component with label, description, and error state support.",
        props: [
            {
                name: "component",
                default: "textarea",
                type: "string | React.ElementType",
                description: "Specifies the root component or HTML element to render the textarea wrapper.",
            },
            {
                name: "label",
                type: "string | React.ReactNode",
                description: "The label displayed above or associated with the textarea.",
            },
            {
                name: "description",
                type: "string | React.ReactNode",
                description: "Additional descriptive text displayed below the textarea.",
            },
            {
                name: "className",
                type: "string",
                description: "Additional CSS class names to apply to the root element.",
            },
            {
                name: "classNames",
                type: "object",
                description: "An object containing CSS class names for specific parts of the textarea component.",
            },
            {
                name: "error",
                type: "string | React.ReactNode",
                description: "Error message or element displayed below the textarea when in an error state.",
            },
            {
                name: "unstyled",
                type: "boolean",
                description: "If true, removes all default styles, allowing for full customization.",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "If true, disables the textarea, preventing user interaction.",
            },
            {
                name: "rootProps",
                type: "object",
                description: "Additional props to pass to the root element of the textarea wrapper.",
            },
            {
                name: "labelProps",
                type: "object",
                description: "Additional props to apply to the label element.",
            },
            {
                name: "id",
                type: "string",
                description: "The ID of the textarea element, useful for associating labels.",
            },
        ],
    }

]
