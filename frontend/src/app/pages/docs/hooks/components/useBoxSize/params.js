export const params = [
    {
        name: 'onResize',
        type: 'function',
        description: "Callback function executed when the observed element is resized.",
    },
    {
        name: 'ref',
        type: 'RefObject',
        description: "A reference to the DOM element being observed for size changes.",
    },
    {
        name: 'box',
        type: 'string',
        default: 'content-box',
        description: "Specifies the box model to observe. Options are 'content-box' (default) or 'border-box'.",
    }
]