import DualTableIcon from 'assets/dualicons/table.svg?react'
import TableIcon from 'assets/nav-icons/table.svg?react'

import { NAV_TYPE_ROOT, NAV_TYPE_ITEM, NAV_TYPE_DIVIDER } from 'constants/app.constant'

const ROOT_APPS = '/tables'

const path = (root, item) => `${root}${item}`;

export const tables = {
    id: 'tables',
    type: NAV_TYPE_ROOT,
    path: '/tables',
    title: 'Tables',
    transKey: 'nav.tables.tables',
    Icon: DualTableIcon,
    childs: [
        {
            id: 'tables.orders-datatable-1',
            path: path(ROOT_APPS, '/orders-datatable-1'),
            type: NAV_TYPE_ITEM,
            title: 'Orders Datatable 1',
            transKey: 'nav.tables.orders-datatable-1',
            Icon: TableIcon
        },
        {
            id: 'tables.orders-datatable-2',
            path: path(ROOT_APPS, '/orders-datatable-2'),
            type: NAV_TYPE_ITEM,
            title: 'Orders Datatable 2',
            transKey: 'nav.tables.orders-datatable-2',
            Icon: TableIcon
        },
        {
            id: 'tables.courses-datatable',
            path: path(ROOT_APPS, '/courses-datatable'),
            type: NAV_TYPE_ITEM,
            title: 'Courses Datatable',
            transKey: 'nav.tables.courses-datatable',
            Icon: TableIcon
        },
        {
            id: 'tables.users-datatable',
            path: path(ROOT_APPS, '/users-datatable'),
            type: NAV_TYPE_ITEM,
            title: 'Users Datatable',
            transKey: 'nav.tables.users-datatable',
            Icon: TableIcon
        },
        {
            id: 'tables.projects-datatable',
            path: path(ROOT_APPS, '/projects-datatable'),
            type: NAV_TYPE_ITEM,
            title: 'Projects Datatable',
            transKey: 'nav.tables.projects-datatable',
            Icon: TableIcon
        },
        {
            id: 'tables.divide-1',
            type: NAV_TYPE_DIVIDER
        },
        {
            id: 'tables.basic-table',
            path: path(ROOT_APPS, '/basic-table'),
            type: NAV_TYPE_ITEM,
            title: 'Basic Table',
            transKey: 'nav.tables.basic-table',
            Icon: TableIcon
        },
        {
            id: 'tables.react-table',
            path: path(ROOT_APPS, '/react-table'),
            type: NAV_TYPE_ITEM,
            title: 'React Table',
            transKey: 'nav.tables.react-table',
            Icon: TableIcon
        },
        {
            id: 'tables.advanced-tables',
            path: path(ROOT_APPS, '/advanced-tables'),
            type: NAV_TYPE_ITEM,
            title: 'Advanced Table',
            transKey: 'nav.tables.advanced-tables',
            Icon: TableIcon
        },
    ]
}
