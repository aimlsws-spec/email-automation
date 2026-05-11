// Import Dependencies
import {
    BellAlertIcon,
    CubeIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { TbCoins, TbDevices, TbPalette } from "react-icons/tb";

// Local Imports
import SettingIcon from "assets/dualicons/setting.svg?react";
import { NAV_TYPE_ITEM } from "constants/app.constant";

// ----------------------------------------------------------------------

export const settings = {
    id: 'settings',
    type: NAV_TYPE_ITEM,
    path: '/settings',
    title: 'Settings',
    transKey: 'nav.settings.settings',
    Icon: SettingIcon,
    childs: [
        {
            id: 'general',
            type: NAV_TYPE_ITEM,
            path: '/settings/general',
            title: 'General',
            transKey: 'nav.settings.general',
            Icon: UserIcon,
        },
        {
            id: 'appearance',
            type: NAV_TYPE_ITEM,
            path: '/settings/appearance',
            title: 'Appearance',
            transKey: 'nav.settings.appearance',
            Icon: TbPalette,
        },
        {
            id: 'billing',
            type: NAV_TYPE_ITEM,
            path: '/settings/billing',
            title: 'Billing',
            transKey: 'nav.settings.billing',
            Icon: TbCoins,
        },
        {
            id: 'notifications',
            type: NAV_TYPE_ITEM,
            path: '/settings/notifications',
            title: 'Notifications',
            transKey: 'nav.settings.notifications',
            Icon: BellAlertIcon,
        },
        {
            id: 'applications',
            type: NAV_TYPE_ITEM,
            path: '/settings/applications',
            title: 'Applications',
            transKey: 'nav.settings.applications',
            Icon: CubeIcon,
        },
        {
            id: 'sessions',
            type: NAV_TYPE_ITEM,
            path: '/settings/sessions',
            title: 'Sessions & Password',
            transKey: 'nav.settings.sessions',
            Icon: TbDevices,
        },
    ]
}