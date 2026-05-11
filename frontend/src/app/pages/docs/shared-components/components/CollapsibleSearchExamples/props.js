export const componentProps = [
    {
        componentName: "CollapsibleSearch",
        desc: "A component for a search input that can expand and collapse.",
        props: [
            {
                name: "defaultState",
                type: "boolean",
                description: "Specifies the initial state of the search button (expanded or collapsed).",
            },
            {
                name: "className",
                type: "string",
                description: "CSS class to be applied to the input element.",
            },
            {
                name: "buttonProps",
                type: "object",
                description: "An object containing properties to customize the button's behavior and appearance.",
            }
        ],
    },
];
