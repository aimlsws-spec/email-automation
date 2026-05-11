export const params = [
    {
        name: 'eventName',
        type: 'string',
        description: 'The name of the event to be attached.'
    },
    {
        name: 'handler',
        type: 'function',
        description: 'The function to execute when the event is triggered.'
    },
    {
        name: 'element',
        type: 'RefObject',
        description: 'The DOM element to which the event listener will be attached.'
    },
    {
        name: 'options',
        type: 'object',
        description: 'An optional configuration object for the event listener.'
    }
]