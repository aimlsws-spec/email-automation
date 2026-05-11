import AppsIcon from 'assets/dualicons/applications.svg?react'
import ChatIcon from 'assets/nav-icons/chat.svg?react'
import KanbanIcon from 'assets/nav-icons/kanban.svg?react'
import MailIcon from 'assets/nav-icons/mail.svg?react'
import CheckDoubleIcon from 'assets/nav-icons/check-double.svg?react'
import Nft1Icon from 'assets/nav-icons/nft-1.svg?react'
import Nft2Icon from 'assets/nav-icons/nft-2.svg?react'
import CloudIcon from 'assets/nav-icons/cloud.svg?react'
import BotIcon from 'assets/nav-icons/bot.svg?react'
import MoneyIcon from 'assets/nav-icons/money.svg?react'
import PinIcon from 'assets/nav-icons/pin.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM, NAV_TYPE_DIVIDER } from 'constants/app.constant'

const ROOT_APPS = '/apps'

const path = (root, item) => `${root}${item}`;

export const apps = {
    id: 'apps',
    type: NAV_TYPE_ROOT,
    path: '/apps',
    title: 'Applications',
    transKey: 'nav.apps.apps',
    Icon: AppsIcon,
    childs: [
        {
            id: 'apps.chat',
            path: path(ROOT_APPS, '/chat'),
            type: NAV_TYPE_ITEM,
            title: 'Chat',
            transKey: 'nav.apps.chat',
            Icon: ChatIcon,
        },
        {
            id: 'apps.ai-chat',
            path: path(ROOT_APPS, '/ai-chat'),
            type: NAV_TYPE_ITEM,
            title: 'AI Chat',
            transKey: 'nav.apps.ai-chat',
            Icon: BotIcon,
        },
        {
            id: 'apps.kanban',
            path: path(ROOT_APPS, '/kanban'),
            type: NAV_TYPE_ITEM,
            title: 'Kanban Board',
            transKey: 'nav.apps.kanban',
            Icon: KanbanIcon,
        },
        {
            id: 'apps.mail',
            path: path(ROOT_APPS, '/mail'),
            type: NAV_TYPE_ITEM,
            title: 'Mail App',
            transKey: 'nav.apps.mail',
            Icon: MailIcon,
        },
        {
            id: 'apps.todo',
            path: path(ROOT_APPS, '/todo'),
            type: NAV_TYPE_ITEM,
            title: 'Todo',
            transKey: 'nav.apps.todo',
            Icon: CheckDoubleIcon,
        },
        {
            id: 'apps.divide-1',
            type: NAV_TYPE_DIVIDER
        },
        {
            id: 'apps.nft-1',
            path: path(ROOT_APPS, '/nft-1'),
            type: NAV_TYPE_ITEM,
            title: 'NFT App v1',
            transKey: 'nav.apps.nft-1',
            Icon: Nft1Icon,
        },
        {
            id: 'apps.nft-2',
            path: path(ROOT_APPS, '/nft-2'),
            type: NAV_TYPE_ITEM,
            title: 'NFT App v2',
            transKey: 'nav.apps.nft-2',
            Icon: Nft2Icon,
        },
        {
            id: 'apps.filemanager',
            path: path(ROOT_APPS, '/filemanager'),
            type: NAV_TYPE_ITEM,
            title: 'File Manager',
            transKey: 'nav.apps.filemanager',
            Icon: CloudIcon,
        },
        {
            id: 'apps.pos',
            path: path(ROOT_APPS, '/pos'),
            type: NAV_TYPE_ITEM,
            title: 'POS Sytem',
            transKey: 'nav.apps.pos',
            Icon: MoneyIcon,
        },
        {
            id: 'apps.travel',
            path: path(ROOT_APPS, '/travel'),
            type: NAV_TYPE_ITEM,
            title: 'Travel',
            transKey: 'nav.apps.travel',
            Icon: PinIcon,
        },
    ]
}
