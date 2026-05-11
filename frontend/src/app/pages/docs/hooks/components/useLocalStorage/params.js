export const params = [
    {
        name: 'key',
        type: 'string',
        description: 'The key used to store the state in local storage.'
    },
    {
        name: 'initialValue',
        type: 'any',
        description: 'The initial value to store in local storage if no existing value is found.'
    },
    {
        name: 'options',
        type: 'object',
        description: 'Configuration options for managing the local storage state.'
    },
    {
        name: 'options.initializeWithValue',
        type: 'boolean',
        default: 'true',
        description: 'Indicates whether to initialize the state with the value from local storage.'
    },
    {
        name: 'options.serializer',
        type: 'function',
        description: 'An optional custom function to serialize the state before storing it in local storage.'
    },
    {
        name: 'options.deserializer',
        type: 'function',
        description: 'An optional custom function to deserialize the state retrieved from local storage.'
    }
];
