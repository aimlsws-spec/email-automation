export const params = [
    {
        name: 'query',
        type: 'string',
        description: 'The media query string to evaluate.'
    },
    {
        name: 'options',
        type: 'object',
        description: 'Additional configuration options for the media query evaluation.'
    },
    {
        name: 'options.defaultValue',
        type: 'boolean',
        default: 'false',
        description: 'Specifies the default value for the media query result before initialization.'
    },
    {
        name: 'options.initializeWithValue',
        type: 'boolean',
        default: 'true',
        description: 'Determines whether to initialize the state with the current media query result.'
    }
];
