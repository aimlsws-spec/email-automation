export const params = [
    {
        name: 'value',
        type: 'boolean',
        description: 'Determines whether the scrollbar should be locked.'
    },
    {
        name: 'options',
        type: 'object',
        description: 'Configuration options for locking the scrollbar.'
    },
    {
        name: 'options.disableBodyPadding',
        type: 'boolean',
        default: 'false',
        description: 'Specifies whether to disable or enable body padding when the scrollbar is locked.'
    }
];
