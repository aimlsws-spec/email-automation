import { NAV_TYPE_ITEM, } from "constants/app.constant";
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import AppsIcon from 'assets/dualicons/applications.svg?react'
import PrototypesIcon from 'assets/dualicons/prototypes.svg?react'
import FormsIcon from 'assets/dualicons/forms.svg?react'
import ComponentsIcon from 'assets/dualicons/components.svg?react'
import TableIcon from 'assets/dualicons/table.svg?react'
import LampIcon from 'assets/dualicons/lamp.svg?react'

export const baseNavigation = [
    {
        id: 'dashboards',
        type: NAV_TYPE_ITEM,
        path: '/dashboards/sales',
        title: 'Dashboards',
        transKey: 'nav.dashboards.dashboards',
        Icon: DashboardsIcon,
    },
    {
        id: 'apps',
        type: NAV_TYPE_ITEM,
        path: '/apps',
        title: 'Applications',
        transKey: 'nav.apps.apps',
        Icon: AppsIcon,
    },
    {
        id: 'prototypes',
        type: NAV_TYPE_ITEM,
        path: '/prototypes/onboarding/onboarding-1',
        title: 'Prototypes',
        transKey: 'nav.prototypes.prototypes',
        Icon: PrototypesIcon,
    },
    {
        id: 'tables',
        type: NAV_TYPE_ITEM,
        path: '/tables/orders-datatable-1',
        title: 'Tables',
        transKey: 'nav.tables.tables',
        Icon: TableIcon,
    },
    {
        id: 'forms',
        type: NAV_TYPE_ITEM,
        path: '/forms/input',
        title: 'Forms',
        transKey: 'nav.forms.forms',
        Icon: FormsIcon,
    },
    {
        id: 'components',
        type: NAV_TYPE_ITEM,
        path: '/components/basic-ui/avatar',
        title: 'Components',
        transKey: 'nav.components.components',
        Icon: ComponentsIcon,
    },
    {
        id: 'docs',
        type: NAV_TYPE_ITEM,
        path: '/docs/getting-started',
        title: 'Documentation',
        transKey: 'nav.docs.docs',
        Icon: LampIcon,
    }
]
