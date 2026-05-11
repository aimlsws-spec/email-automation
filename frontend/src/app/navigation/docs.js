import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import LampIcon from 'assets/dualicons/lamp.svg?react'
import SharedComponentsIcon from 'assets/nav-icons/shared-components.svg?react'
import HooksIcon from 'assets/nav-icons/hooks.svg?react'
import UtilityIcon from 'assets/nav-icons/utility.svg?react'
import AttributionsIcon from 'assets/nav-icons/attributions.svg?react'
import ChangelogsIcon from 'assets/nav-icons/changelogs.svg?react'

import { NAV_TYPE_ROOT, NAV_TYPE_ITEM, NAV_TYPE_DIVIDER } from 'constants/app.constant'

const ROOT_DOCS = '/docs'

const path = (root, item) => `${root}${item}`;

export const docs = {
    id: 'docs',
    type: NAV_TYPE_ROOT,
    path: '/docs',
    title: 'Documentation',
    transKey: 'nav.docs.docs',
    Icon: LampIcon,
    childs: [
        {
            id: 'docs.getting-started',
            path: path(ROOT_DOCS, '/getting-started'),
            type: NAV_TYPE_ITEM,
            title: 'Getting Started',
            transKey: 'nav.docs.getting-started',
            Icon: RocketLaunchIcon,
        },
        {
            id: 'docs.shared-components',
            path: path(ROOT_DOCS, '/shared-components'),
            type: NAV_TYPE_ITEM,
            title: 'Shared Components',
            transKey: 'nav.docs.shared-components',
            Icon: SharedComponentsIcon,
        },
        {
            id: 'docs.hooks',
            path: path(ROOT_DOCS, '/hooks'),
            type: NAV_TYPE_ITEM,
            title: 'Hooks',
            transKey: 'nav.docs.hooks',
            Icon: HooksIcon,
        },
        {
            id: "docs.utils",
            path: path(ROOT_DOCS, '/utils'),
            type: NAV_TYPE_ITEM,
            title: 'Utils',
            transKey: 'nav.docs.utils',
            Icon: UtilityIcon,
        },
        {
            id: "docs-dividers",
            type: NAV_TYPE_DIVIDER
        },
        {
            id: "docs.attributions",
            path: path(ROOT_DOCS, '/attributions'),
            type: NAV_TYPE_ITEM,
            title: 'Attributions',
            transKey: 'nav.docs.attributions',
            Icon: AttributionsIcon,
        },
        {
            id: "docs.changelogs",
            path: path(ROOT_DOCS, '/changelogs'),
            type: NAV_TYPE_ITEM,
            title: 'Changelogs',
            transKey: 'nav.docs.changelogs',
            Icon: ChangelogsIcon,
        },
    ]
}
