import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'
import MailIcon from 'assets/nav-icons/megaphone.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = '/dashboards'

const path = (root, item) => `${root}${item}`;

export const dashboards = {
    id: 'dashboards',
    type: NAV_TYPE_ROOT,
    path: '/dashboards',
    title: 'Email Workflow',
    transKey: 'nav.dashboards.dashboards',
    Icon: DashboardsIcon,
    childs: [
        {
            id: 'dashboards.email-analytics',
            path: path(ROOT_DASHBOARDS, '/email-analytics'),
            type: NAV_TYPE_ITEM,
            title: 'Email Analytics',
            transKey: 'nav.dashboards.email-analytics',
            Icon: StatisticIcon,
        },
        {
            id: 'dashboards.send-emails',
            path: path(ROOT_DASHBOARDS, '/send-emails'),
            type: NAV_TYPE_ITEM,
            title: 'Send Emails',
            transKey: 'nav.dashboards.send-emails',
            Icon: MailIcon,
        },
    ]
}
