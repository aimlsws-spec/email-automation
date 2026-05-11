// Local Imports
import { randomId } from "utils/randomId"

// ----------------------------------------------------------------------

const now = new Date();

export const histories = [
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
        name: 'Konnor Guzman',
        avatar: '/images/avatar/avatar-20.jpg'
    },
    {
        uid: '4',
        name: 'Travis Fuller',
        avatar: null
    },
    {
        uid: '5',
        name: 'Alfredo Elliott',
        avatar: '/images/avatar/avatar-4.jpg'
    },
    {
        uid: '6',
        name: 'Henry Curtis',
        avatar: null
    },
    {
        uid: '10',
        name: 'Lance Tucker',
        avatar: '/images/avatar/avatar-18.jpg'
    },
    {
        uid: '11',
        name: 'Katrina West',
        avatar: '/images/avatar/avatar-11.jpg'
    },
    {
        uid: '12',
        name: 'Samantha Shelton',
        avatar: '/images/avatar/avatar-8.jpg'
    },
    {
        uid: '13',
        name: 'Corey Evans',
        avatar: '/images/avatar/avatar-1.jpg'
    },
    {
        uid: '14',
        name: 'Joe Perkins',
        avatar: '/images/avatar/avatar-5.jpg'
    },
    {
        uid: '15',
        name: 'Henry Cavil',
        avatar: null
    },
]

export const fakeChats = [
    {
        id: 'chat-1',
        unreadCount: 5,
        isMuted: true,
        isImportant: false,
        isOnline: true,
        profile: {
            uid: '1',
            name: 'Alfredo Elliott',
            avatar: null
        },
        lastMessage: {
            content: '😂 Please Download This File',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 3),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: "Hey there! How's your day going?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 19, 47),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Hi! It's going well, thanks for asking. Just finished a productive morning. What about you?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 19, 49),
            },
            {
                id: randomId(),
                isMe: true,
                content: "That's great to hear! My morning was a bit hectic, but I'm getting caught up now. What are you working on today?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 19, 50),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Oh no, hectic mornings are no fun!  I'm currently tackling a project on topic.  How about you?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 4),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Ooh, that sounds interesting!  I'm actually writing some code for a new feature in our app.  Wish me luck!",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 51),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Good luck with the coding!  I know you'll nail it.  Speaking of features, have you seen the new app/website update? They added a cool new feature.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 54),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Oh, I haven't actually!  I'll definitely have to check it out after lunch.  Maybe it'll inspire some ideas for our app too. ",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Sounds good!  Let's chat again later and see how things are going. ",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 2),
            },
            {
                id: randomId(),
                isMe: false,
                content: '😂 Please Download This File',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 3),
            },
        ]
    },
    {
        id: 'chat-2',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '2',
            name: 'Konnor Guzman',
            avatar: '/images/avatar/avatar-20.jpg'
        },
        lastMessage: {
            content: 'I will check it',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 16),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: "Hey, can you add some milk and eggs to the shopping list? We're almost out!",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 11),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Sure, I added them! Anything else?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 12),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'And thats why a 15th century',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 13),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Oh, and maybe some bread too. Thanks!",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 14),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'I will check it',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 16),
            },
        ]
    },
    {
        id: 'chat-3',
        unreadCount: 4,
        isMuted: false,
        isImportant: true,
        isOnline: true,
        profile: {
            uid: '3',
            name: 'Travis Fuller',
            avatar: '/images/avatar/avatar-18.jpg'
        },
        lastMessage: {
            content: 'The reviews seem pretty positive. We can always check some trailers online!',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 15),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: "What movie should we watch tonight? Any ideas?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 10),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Hmm, I was thinking a comedy. How about that new one with actor?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 12),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Sounds good! I haven't heard much about it, is it any good?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 13),
            },
            {
                id: randomId(),
                isMe: false,
                content: "The reviews seem pretty positive. We can always check some trailers online!",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 15),
            },
        ]
    },
    {
        id: 'chat-4',
        unreadCount: 2,
        isMuted: true,
        isImportant: false,
        isOnline: true,
        profile: {
            uid: '4',
            name: 'Derrick Simmons',
            avatar: '/images/avatar/avatar-14.jpg'
        },
        lastMessage: {
            content: 'Sounds like a plan. See you all soon!',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 21),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Hi everyone, just a reminder about our team meeting today at 2 PM. Let\'s discuss the upcoming project deadline.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 10),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Sounds good. Is there anything specific you\'d like us to prepare for the meeting?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 11),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Great question. I\'d love for everyone to come prepared to discuss potential roadblocks and any questions you have about the project tasks.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 12),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Got it! I\'ll take a look at my assigned tasks and make a list of any questions that come up.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 13),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'I can also bring some initial design mockups to share if that would be helpful.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 14),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'That would be fantastic, team member! Thanks for taking the initiative.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 15),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'No problem! Looking forward to the meeting.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 16),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Just a heads up, I might be running a few minutes late due. I\'ll join as soon as I can.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 17),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'No worries. We can start with introductions and catching up on everyone\'s progress.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 19),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Sounds like a plan. See you all soon!',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 21),
            },
        ]
    },
    {
        id: 'chat-5',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: true,
        profile: {
            uid: '5',
            name: 'Grace Buckland',
            avatar: '/images/avatar/avatar-6.jpg'
        },
        lastMessage: {
            content: 'Agreed! Let\'s keep this momentum going and prioritize these customer-focused initiatives.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 21),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Hi team, I\'d like to discuss some ideas for improving customer relations. What are some challenges you\'ve been facing recently?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 29),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Hey, a few customers have mentioned long wait times on the support line. Maybe we could explore ways to streamline the process?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 30),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Thanks for bringing that up. That\'s a great point. Perhaps we can implement a live chat option or improve our FAQ section.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 36),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely! Additionally, I\'ve noticed some customers feel our follow-up emails after purchases could be more personalized.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 38),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Interesting observation, team member. How can we personalize those emails more effectively?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 39),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'We could include specific product recommendations based on their purchase history or offer loyalty program benefits.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 41),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Those are both fantastic suggestions! Let\'s brainstorm some draft email templates with those ideas in mind.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 17),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Sounds good! I can also put together a survey to gather customer feedback on their experience.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 18),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Perfect. By working together, I\'m confident we can significantly improve customer relations.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 20),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Agreed! Let\'s keep this momentum going and prioritize these customer-focused initiatives.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 21),
            },
        ]
    },
    {
        id: 'chat-6',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '6',
            name: 'Katrina West',
            avatar: '/images/avatar/avatar-11.jpg'
        },
        lastMessage: {
            content: 'Sounds like a plan! Let me know what you all find and we can place the order.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 21),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Anyone up for some fast food for lunch? Feeling a burger and fries kind of day!',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 12),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Ooh, sounds good! I could go for some nuggets too. Any specific place in mind?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 13),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'There is that new Fast food restaurant place that just opened down the street. Have you tried it? Otherwise, we could stick to our usual burger.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 14),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Haven\'t been to the new one yet, but I\'m always down for trying something new!  Let\'s check out Fast food restaurant.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 15),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Maybe we can look at their menus online first and see what everyone is craving?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 16),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Great idea. That way we can all decide and order ahead of time to avoid the lunch rush.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 17),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Perfect! I\'m on it. Anyone have any dietary restrictions or preferences we should keep in mind?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 18),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Nope, I\'m good with anything on the menu. Team member, how about you?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 19),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'I usually go for the veggie burger option, but their fries are amazing!',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 20),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Sounds like a plan! Let me know what you all find and we can place the order.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 21),
            },
        ]
    },
    {
        id: 'chat-7',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '7',
            name: 'Corey Evans',
            avatar: '/images/avatar/avatar-13.jpg'
        },
        lastMessage: {
            content: 'I\'m on board!  Looking forward to learning more about React and Next.js together.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 56),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Hey everyone, I\'m thinking of using React for our next web project. What are your thoughts on it?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 6),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Great choice! React is a very popular and powerful library for building user interfaces.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 7),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Right? I especially like its component-based architecture for building reusable UI elements.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 8),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely! It makes code more organized and maintainable. Have you considered using a framework like Next.js on top of React?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 9),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Next.js sounds interesting! What advantages does it offer compared to using plain React?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 11),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Next.js provides features like server-side rendering, automatic code splitting, and built-in routing, which can streamline development and improve SEO.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 42),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'That sounds very useful! Maybe we can explore some tutorials or documentation on Next.js together.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 44),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely! I\'m happy to help you get started. There are also some great online communities for React developers where we can find answers and resources.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 50),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Perfect!  I think this could be a great choice for our project.  Let\'s set up a meeting to discuss it further and explore Next.js.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 54),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'I\'m on board!  Looking forward to learning more about React and Next.js together.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 56),
            },
        ]
    },
    {
        id: 'chat-8',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '8',
            name: 'Anthony Jensen',
            avatar: '/images/avatar/avatar-10.jpg'
        },
        lastMessage: {
            content: 'Absolutely. Maybe instead of fearing replacement, we can explore how AI can empower us to become even more effective front-end developers.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 56),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Has anyone else heard about AI potentially replacing front-end developers in the future?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 48),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Yeah, it\'s a common concern these days. AI is definitely getting more advanced.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 49),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'True, but I wonder if AI could ever truly handle the creative and user-centric aspects of front-end development?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 50),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Good point.  AI might be good at automating repetitive tasks, but designing intuitive and engaging user interfaces still requires human creativity.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 51),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Exactly. Plus, staying up-to-date with the latest trends and technologies is crucial for front-end devs. Can AI keep pace with that constant evolution?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 52),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Thats a good question. Maybe AI could assist us by generating code snippets or suggesting design elements, but I doubt it can fully replace our expertise.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 53),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'That sounds like a positive way to look at it.  By embracing AI as a tool, we can potentially enhance our workflows and create even better user experiences.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 54),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Agreed. It is important to stay informed about AI advancements but also focus on honing our unique skills that AI cant replicate.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 55),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely. Maybe instead of fearing replacement, we can explore how AI can empower us to become even more effective front-end developers.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 56),
            },
        ]
    },
    {
        id: 'chat-9',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '9',
            name: 'Joe Perkins',
            avatar: '/images/avatar/avatar-2.jpg'
        },
        lastMessage: {
            content: 'That is a possibility! With advancements in communication technology, location might become less of a barrier for many jobs.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 12),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Hey everyone, with 2030 just around the corner, what jobs do you think will be in high demand?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 1),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Interesting question! With AI on the rise, I imagine tech-related fields will continue to be important.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 3),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Definitely! Maybe specializations like AI ethicists or cybersecurity experts will be crucial',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 4),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely! But there will also likely be a need for human skills that AI cant replicate, like creativity and complex problem-solving',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 5),
            },
            {
                id: randomId(),
                isMe: true,
                content: ' You are right! Perhaps fields like sustainable energy or robotics engineering will require that human touch.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 6),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'And do not forget the human element in healthcare! Doctors, nurses, and therapists will likely always be needed',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 7),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Great point! There might also be a rise in jobs focused on mental health and well-being as technology continues to evolve.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 8),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely! Specialists in areas like virtual reality therapy or digital detox coaching could be in demand.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 9),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'This is a fun thought experiment! Maybe remote work opportunities will become even more common across various fields.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 10),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'That is a possibility! With advancements in communication technology, location might become less of a barrier for many jobs.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 12),
            },
        ]
    },
    {
        id: 'chat-10',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '10',
            name: 'Lance Tucker',
            avatar: '/images/avatar/avatar-1.jpg'
        },
        lastMessage: {
            content: 'Agreed! By staying informed and adaptable, we can thrive in the coming years.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 14, 2),
        },
        messages: [
            {
                id: randomId(),
                isMe: false,
                content: 'This conversation is making me curious! Does anyone have resources or articles on predicted job trends for 2030?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 44),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'I found a few interesting reports from future of work institutes. Let me share the links!rends for 2030?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 48),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Perfect! Thanks. Maybe we can skim them together and highlight key points.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 50),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Sounds good! We can also check out job boards or company websites to see what skills they are currently looking for.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 52),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Great idea! That might give us insights into what skills will be valuable in the near future.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 54),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Maybe future-proofing our skillsets by taking online courses or attending workshops could be beneficial.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 56),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely! Lifelong learning will likely be essential in this ever-changing job market.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 57),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'We can also leverage our networks and reach out to professionals in fields that interest us.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 58),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Networking and informational interviews can provide valuable insights. The future of work is exciting!',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 14, 0),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Agreed! By staying informed and adaptable, we can thrive in the coming years.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 14, 2),
            },
        ]
    },
    {
        id: 'chat-11',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '11',
            name: 'Samantha Shelton',
            avatar: '/images/avatar/avatar-7.jpg'
        },
        lastMessage: {
            content: 'Yes, Tailwind only generates the styles you actually use in your project. That keeps your website nice and lightweight.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 33),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Has anyone tried Tailwind CSS for our latest project? I am curious about its utility-first approach.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 20),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Yeah, I have been using it for a while now. Tailwind is fantastic for rapidly building UIs without needing a ton of custom CSS.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 22),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Interesting! Does it feel restrictive having pre-defined utility classes instead of writing your own CSS?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 24),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Actually, Tailwind gives you a lot of flexibility. You can combine and customize utilities to achieve almost any design you want.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 25),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'That is good to know. And how is the learning curve for beginners on the team?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 27),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Tailwind is syntax is pretty easy to pick up, especially compared to more complex frameworks. There are tons of tutorials and resources available too.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 28),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Sounds promising! Maybe we can explore some basic Tailwind components together and see if it fits our workflow.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 29),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely! We can set up a quick prototype and see how fast we can build something with Tailwind.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 30),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Another benefit I heard about is Tailwind is minimal runtime footprint. Is that true?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 31),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Yes, Tailwind only generates the styles you actually use in your project. That keeps your website nice and lightweight.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10, 33),
            },
        ]
    },
    {
        id: 'chat-12',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '12',
            name: 'Raul Bradley',
            avatar: '/images/avatar/avatar-5.jpg'
        },
        lastMessage: {
            content: 'Absolutely! We should also consider if the template offers features like email integration or multi-language support depending on our needs.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 19),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Hey everyone, we are in the market for a new admin template. What features do you consider essential for a smooth workflow?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 10),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Hi, a clean and user-friendly dashboard is definitely a must-have. Easy navigation and clear data visualization are key.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 11),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Absolutely! Responsive design is crucial too. The template should adapt seamlessly to different screen sizes.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 12),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Agreed! We also need a variety of pre-built UI components like buttons, forms, and tables to save us development time.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 13),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Great point! And how about data tables with sorting, filtering, and pagination functionalities?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 14),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Essential! Being able to manage large datasets efficiently is a big time saver.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 15),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Couldn it agree more. Do any of you prefer templates with built-in authentication functionalities?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 16),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'That could be handy, especially if the template offers different user role management options.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 17),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Interesting! Security is paramount, so secure password hashing and user session management are important.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 18),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Absolutely! We should also consider if the template offers features like email integration or multi-language support depending on our needs.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 19),
            },
        ]
    },
    {
        id: 'chat-13',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '13',
            name: 'Henry Curtis',
            avatar: '/images/avatar/avatar-3.jpg'
        },
        lastMessage: {
            content: 'Remix also has a strong focus on data fetching and routing, which can streamline development. Next.js has a larger community and more resources available online.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: 'Hey everyone, we are deciding between Remix and Next.js for our next project. Anyone have experience with both frameworks?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Yes, I have used both! They are both great options, but they have some key differences.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Interesting! What are some of the main considerations when choosing between Remix and Next.js?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Well, Remix focuses on server-side rendering by default, which can be good for SEO and performance. Next.js offers more flexibility with static site generation and client-side rendering options.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'That is helpful! Maybe we should consider the type of content on our website and prioritize SEO or user interactivity.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'Remix also has a strong focus on data fetching and routing, which can streamline development. Next.js has a larger community and more resources available online.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Interesting! So Remix might be a good choice for complex data-driven applications, while Next.js could be better for simpler websites or marketing pages?',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
            {
                id: randomId(),
                isMe: false,
                content: 'That is a good way to think about it, although both frameworks can handle a variety of project types.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
            {
                id: randomId(),
                isMe: true,
                content: 'Remix also has a strong focus on data fetching and routing, which can streamline development. Next.js has a larger community and more resources available online.',
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 19, 13),
            },
        ]
    },
    {
        id: 'chat-14',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '14',
            name: 'Robert Pattinson',
            avatar: null
        },
        lastMessage: {
            content: 'Great! I found a few resources that explain RWD concepts in detail.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 9),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: "Hey! I'm interested in learning more about responsive web design.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 16, 2),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Sure, responsive web design (RWD) is an approach to make websites look good and function well on all devices, from desktops to tablets and smartphones.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 16, 9),
            },
            {
                id: randomId(),
                isMe: true,
                content: "That's great! So how does it work exactly?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 16, 10),
            },
            {
                id: randomId(),
                isMe: false,
                content: "RWD uses techniques like flexible layouts, fluid images, and media queries to adjust the content based on the screen size.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 16, 11),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Interesting! Are there any benefits to using RWD?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 16, 19),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Absolutely! RWD provides a better user experience for everyone, regardless of their device. It also improves SEO and reduces maintenance needs since you only need one website.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 0),
            },
            {
                id: randomId(),
                isMe: true,
                content: "That makes sense. Are there any resources you recommend for learning more?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 2),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Sure, there are many great resources available online! I can share some articles or tutorials if you'd like.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 4),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Yes please! That would be helpful.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 8),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Great! I found a few resources that explain RWD concepts in detail.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 9),
            },
        ]
    },
    {
        id: 'chat-15',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '15',
            name: 'Henry Cavill',
            avatar: '/images/avatar/avatar-19.jpg'
        },
        lastMessage: {
            content: 'This is interesting! I might have to explore ThemeForest for my next website project.',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 9),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: "Thinking of building a new website? Have you checked out ThemeForest?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 15, 45),
            },
            {
                id: randomId(),
                isMe: false,
                content: "ThemeForest? Isn't that a platform for website templates?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 15, 48),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Exactly! They have a huge selection of themes for different platforms like WordPress, Shopify, and even landing pages.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 15, 52),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Wow, that's diverse! How do you know which theme to choose?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 16, 0),
            },
            {
                id: randomId(),
                isMe: true,
                content: "They have filters and categories to narrow it down by industry, features, and price. Plus, most themes have demos and reviews to help you decide.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 16, 11),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Sounds convenient. Are the themes customizable?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 16, 49),
            },
            {
                id: randomId(),
                isMe: true,
                content: "For sure! Most themes offer a good amount of customization options like changing colors, fonts, and layouts.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 4),
            },
            {
                id: randomId(),
                isMe: false,
                content: "That's impressive! What about the quality? Are they reliable?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 7),
            },
            {
                id: randomId(),
                isMe: true,
                content: "ThemeForest has a rating system and author reviews, so you can check user experiences. Plus, many themes come with ongoing support from the developer.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 8),
            },
            {
                id: randomId(),
                isMe: false,
                content: "This is interesting! I might have to explore ThemeForest for my next website project.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 9),
            },
        ]
    },
    {
        id: 'chat-16',
        unreadCount: 0,
        isMuted: true,
        isImportant: false,
        isOnline: false,
        profile: {
            uid: '16',
            name: 'David Corenswet',
            avatar: '/images/avatar/avatar-17.jpg'
        },
        lastMessage: {
            content: 'Wow, thats a lot of Batman content! Where would you recommend someone start if they are new to the comics?',
            createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 18),
        },
        messages: [
            {
                id: randomId(),
                isMe: true,
                content: "Did you watch the new Batman movie?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 2),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Not yet! I heard it's pretty dark and gritty. Is it worth checking out?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 5),
            },
            {
                id: randomId(),
                isMe: true,
                content: "For sure! It's a different take on Batman, but it stays true to the character's detective roots.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 9),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Oh, I like that aspect of Batman. What kind of detective work does he do in the movie?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 10),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Let's just say he has to solve a series of puzzles and riddles left behind by a mysterious villain.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 12),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Ooh, that sounds intriguing! Is it Robert Pattinson who plays Batman this time?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 14),
            },
            {
                id: randomId(),
                isMe: true,
                content: "Yep! And I gotta say, he does a fantastic job. He really captures the brooding intensity of Bruce Wayne.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 15),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Cool! I might have to give it a watch then. But Batman isn't just about the movies, right? There are comics too?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 16),
            },
            {
                id: randomId(),
                isMe: true,
                content: "absolutely! Batman has one of the richest comic book histories out there. There are hundreds of stories exploring his fight for justice in Gotham.",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 17),
            },
            {
                id: randomId(),
                isMe: false,
                content: "Wow, that's a lot of Batman content! Where would you recommend someone start if they're new to the comics?",
                createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 11, 18),
            },
        ]
    },
];

export const profile = {
    uid: '1',
    name: 'Alfredo Elliott',
    avatar: null
}
