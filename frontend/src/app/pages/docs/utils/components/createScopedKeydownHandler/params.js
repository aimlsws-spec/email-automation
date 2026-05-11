export const params = [
    {
        name: 'parentSelector',
        type: 'string',
        description: 'The CSS selector for the parent container where navigation is scoped.'
    },
    {
        name: 'siblingSelector',
        type: 'string',
        description: 'The CSS selector for sibling elements to navigate between.'
    },
    {
        name: 'onKeyDown',
        type: 'function',
        description: 'Callback function invoked on every keydown event.'
    },
    {
        name: 'loop',
        default: true,
        type: 'boolean',
        description: 'Determines if navigation should loop back to the start or end.'
    },
    {
        name: 'activateOnFocus',
        default: false,
        type: 'boolean',
        description: 'Indicates whether to activate (e.g., click) elements on focus.'
    },
    {
        name: 'dir',
        default: 'document.documentElement.dir',
        type: 'string',
        description: 'The text direction ("ltr" or "rtl") to determine navigation behavior.'
    },
    {
        name: 'orientation',
        type: 'string',
        description: 'Specifies the navigation orientation ("horizontal", "vertical").'
    }
];
