const now = new Date()

export const fakeTodos = [
    {
        id: "1",
        title: "Unit Testing",
        slug: "unit-testing",
        isImportant: false,
        isDone: true,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay() + 1, 4, 0),
        assignedTo: [
            {
                uid: '1',
                name: 'John Doe',
                avatar: null
            },
            {
                uid: '2',
                name: 'Emilia Clarke',
                avatar: '/images/avatar/avatar-11.jpg'
            },
            {
                uid: '5',
                name: 'Henry Curtis',
                avatar: null
            },
            {
                uid: '6',
                name: 'Lance Tucker',
                avatar: '/images/avatar/avatar-18.jpg'
            }
        ],
        labels: [
            {
                id: '2',
                color: 'success',
                text: 'Low'
            },
        ],
    },
    {
        id: "2",
        title: "Chat App Fragment",
        slug: "chat-app-fragment",
        isImportant: true,
        isDone: false,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay() + 1, 11, 30),
        assignedTo: [
            {
                uid: '2',
                name: 'Emilia Clarke',
                avatar: '/images/avatar/avatar-11.jpg'
            }
        ],
        labels: [
            {
                id: '3',
                color: 'warning',
                text: 'Medium'
            },
            {
                id: '5',
                color: 'info',
                text: 'Update'
            }
        ],
    },
    {
        id: "3",
        title: "Design UI",
        slug: "design-ui",
        isImportant: false,
        isDone: false,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: null,
        assignedTo: [
            {
                uid: '3',
                name: 'Travis Fuller',
                avatar: null
            }
        ],
        labels: [
            {
                id: '2',
                color: 'success',
                text: 'Low'
            },
        ],
    },
    {
        id: "4",
        title: "Launch New Homepage",
        slug: "launch-new-homepage",
        isImportant: false,
        isDone: false,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay() + 2, 12, 0),
        assignedTo: [
            {
                uid: '4',
                name: 'Alfredo Elliott',
                avatar: '/images/avatar/avatar-4.jpg'
            }
        ],
        labels: [
            {
                id: '5',
                color: 'info',
                text: 'Update'
            }
        ],
    },
    {
        id: "5",
        title: "Review Announcement Blog",
        slug: "review-announcement-blog",
        isImportant: true,
        isDone: false,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay() + 2, 8, 0),
        assignedTo: [
            {
                uid: '5',
                name: 'Henry Curtis',
                avatar: null
            }
        ],
        labels: [
            {
                id: '3',
                color: 'warning',
                text: 'Medium'
            },
        ],
    },
    {
        id: "6",
        title: "Sync With Google Analytics",
        slug: "sync-with-google-analytics",
        isImportant: false,
        isDone: true,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay(), 9, 0),
        assignedTo: [
            {
                uid: '6',
                name: 'Lance Tucker',
                avatar: '/images/avatar/avatar-18.jpg'
            }
        ],
        labels: [],
    },
    {
        id: "7",
        title: "Convert Figma To React",
        slug: "convert-figma-to-react",
        isImportant: false,
        isDone: false,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay() + 9, 9, 0),
        assignedTo: [],
        labels: [
            {
                id: '2',
                color: 'success',
                text: 'Low'
            },
        ],
    },
    {
        id: "8",
        title: "Design Setting Page",
        slug: "design-setting-page",
        isImportant: false,
        isDone: false,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay() + 4, 8, 0),
        assignedTo: [
            {
                uid: '2',
                name: 'Emilia Clarke',
                avatar: '/images/avatar/avatar-11.jpg'
            }
        ],
        labels: [
            {
                id: '4',
                color: 'error',
                text: 'High'
            },
        ],
    },
    {
        id: "9",
        title: "Backup Settings",
        slug: "backup-settings",
        isImportant: true,
        isDone: true,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay(), 16, 0),
        assignedTo: [
            {
                uid: '4',
                name: 'Alfredo Elliott',
                avatar: '/images/avatar/avatar-4.jpg'
            }
        ],
        labels: [
            {
                id: '1',
                color: 'primary',
                text: 'Daily',
            },
            {
                id: '4',
                color: 'error',
                text: 'High'
            },
        ],
    },
    {
        id: "10",
        title: "Create Inventory Module",
        slug: "create-inventory-module",
        isImportant: false,
        isDone: false,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis incidunt nostrum repellat.",
        dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDay() + 2, 16, 0),
        assignedTo: [
            {
                uid: '6',
                name: 'Lance Tucker',
                avatar: '/images/avatar/avatar-18.jpg'
            }
        ],
        labels: [
            {
                id: '2',
                color: 'success',
                text: 'Low'
            },
        ],
    },
]

export const allUsers = [
    {
        uid: '1',
        name: 'John Doe',
        avatar: null
    },
    {
        uid: '2',
        name: 'Emilia Clarke',
        avatar: '/images/avatar/avatar-11.jpg'
    },
    {
        uid: '3',
        name: 'Travis Fuller',
        avatar: null
    },
    {
        uid: '4',
        name: 'Alfredo Elliott',
        avatar: '/images/avatar/avatar-4.jpg'
    },
    {
        uid: '5',
        name: 'Henry Curtis',
        avatar: null
    },
    {
        uid: '6',
        name: 'Lance Tucker',
        avatar: '/images/avatar/avatar-18.jpg'
    },
    {
        uid: '7',
        name: 'Katrina West',
        avatar: '/images/avatar/avatar-11.jpg'
    },
]

export const labels = [
    {
        id: '1',
        color: 'primary',
        text: 'Daily',
    },
    {
        id: '2',
        color: 'success',
        text: 'Low'
    },
    {
        id: '3',
        color: 'warning',
        text: 'Medium'
    },
    {
        id: '4',
        color: 'error',
        text: 'High'
    },
    {
        id: '5',
        color: 'info',
        text: 'Update'
    }
]
