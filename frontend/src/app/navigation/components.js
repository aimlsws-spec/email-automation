import ComponentsIcon from 'assets/dualicons/components.svg?react'
import ModalIcon from 'assets/nav-icons/modal.svg?react'
import PaginationIcon from 'assets/nav-icons/pagination.svg?react'
import OnboardingIcon from 'assets/nav-icons/onboarding.svg?react'
import InfoIcon from 'assets/nav-icons/info.svg?react'
import CirclebarIcon from 'assets/nav-icons/circlebar.svg?react'
import ButtonIcon from 'assets/nav-icons/button.svg?react'
import DocIcon from 'assets/nav-icons/doc.svg?react'

import { NAV_TYPE_ROOT, NAV_TYPE_ITEM, NAV_TYPE_COLLAPSE } from 'constants/app.constant'

const ROOT_COMPONENTS = '/components'

const path = (root, item) => `${root}${item}`;

export const components = {
    id: 'components',
    type: NAV_TYPE_ROOT,
    path: '/components',
    title: 'Components',
    transKey: 'nav.components.components',
    Icon: ComponentsIcon,
    childs: [
        {
            id: 'components.basic-ui',
            type: NAV_TYPE_COLLAPSE,
            path: path(ROOT_COMPONENTS, '/basic-ui'),
            title: 'Basic UI',
            transKey: 'nav.components.basic-ui.basic-ui',
            Icon: ButtonIcon,
            childs: [
                {
                    id: 'components.basic-ui.avatar',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/basic-ui/avatar'),
                    title: 'Avatar',
                    transKey: 'nav.components.basic-ui.avatar',
                },
                {
                    id: 'components.basic-ui.button',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/basic-ui/button'),
                    title: 'Button',
                    transKey: 'nav.components.basic-ui.button',
                },
                {
                    id: 'components.basic-ui.badge',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/basic-ui/badge'),
                    title: 'Badge',
                    transKey: 'nav.components.basic-ui.badge',
                },
                {
                    id: 'components.basic-ui.tag',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/basic-ui/tag'),
                    title: 'Tag',
                    transKey: 'nav.components.basic-ui.tag',
                },
                {
                    id: 'components.basic-ui.divider',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/basic-ui/divider'),
                    title: 'Divider',
                    transKey: 'nav.components.basic-ui.divider',
                },
                {
                    id: 'components.basic-ui.typography',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/basic-ui/typography'),
                    title: 'Typography',
                    transKey: 'nav.components.basic-ui.typography',
                },
            ]
        },
        {
            id: 'components.data-display',
            type: NAV_TYPE_COLLAPSE,
            path: path(ROOT_COMPONENTS, '/data-display'),
            title: 'Data Display',
            transKey: 'nav.components.data-display.data-display',
            Icon: DocIcon,
            childs: [
                {
                    id: 'components.data-display.box',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/data-display/box'),
                    title: 'Box',
                    transKey: 'nav.components.data-display.box',
                },
                {
                    id: 'components.data-display.popover',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/data-display/popover'),
                    title: 'Popover',
                    transKey: 'nav.components.data-display.popover',
                },
                {
                    id: 'components.data-display.timeline',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/data-display/timeline'),
                    title: 'Timeline',
                    transKey: 'nav.components.data-display.timeline',
                },
                {
                    id: 'components.data-display.collapse',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/data-display/collapse'),
                    title: 'Collapse',
                    transKey: 'nav.components.data-display.collapse',
                },
                {
                    id: 'components.data-display.legend',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/data-display/legend'),
                    title: 'Legend',
                    transKey: 'nav.components.data-display.legend',
                },
                {
                    id: 'components.data-display.mask',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/data-display/mask'),
                    title: 'Mask',
                    transKey: 'nav.components.data-display.mask',
                },
                {
                    id: 'components.data-display.contextual-help',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/data-display/contextual-help'),
                    title: 'Contextual Help',
                    transKey: 'nav.components.data-display.contextual-help',
                },
            ]
        },
        {
            id: 'components.navigation',
            type: NAV_TYPE_COLLAPSE,
            path: path(ROOT_COMPONENTS, '/navigation'),
            title: 'Navigation',
            transKey: 'nav.components.navigation.navigation',
            Icon: PaginationIcon,
            childs: [
                {
                    id: 'components.navigation.accordion',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/navigation/accordion'),
                    title: 'Accordion',
                    transKey: 'nav.components.navigation.accordion',
                },
                {
                    id: 'components.navigation.tab',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/navigation/tab'),
                    title: 'Tab',
                    transKey: 'nav.components.navigation.tab',
                },
                {
                    id: 'components.navigation.dropdown',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/navigation/dropdown'),
                    title: 'Dropdown',
                    transKey: 'nav.components.navigation.dropdown',
                },
                {
                    id: 'components.navigation.steps',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/navigation/steps'),
                    title: 'Steps',
                    transKey: 'nav.components.navigation.steps',
                },
                {
                    id: 'components.navigation.pagination',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/navigation/pagination'),
                    title: 'Pagination',
                    transKey: 'nav.components.navigation.pagination',
                },
                {
                    id: 'components.navigation.menu-list',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/navigation/menu-list'),
                    title: 'Menu List',
                    transKey: 'nav.components.navigation.menu-list',
                },
                {
                    id: 'components.navigation.treeview',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/navigation/treeview'),
                    title: 'Treeview',
                    transKey: 'nav.components.navigation.treeview',
                },
            ]
        },
        {
            id: 'components.loading',
            type: NAV_TYPE_COLLAPSE,
            path: path(ROOT_COMPONENTS, '/loading'),
            title: 'Loading',
            transKey: 'nav.components.loading.loading',
            Icon: CirclebarIcon,
            childs: [
                {
                    id: 'components.loading.progress',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/loading/progress'),
                    title: 'Progress',
                    transKey: 'nav.components.loading.progress',
                },
                {
                    id: 'components.loading.circlebar',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/loading/circlebar'),
                    title: 'Circlebar',
                    transKey: 'nav.components.loading.circlebar',
                },
                {
                    id: 'components.loading.skeleton',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/loading/skeleton'),
                    title: 'Skeleton',
                    transKey: 'nav.components.loading.skeleton',
                },
                {
                    id: 'components.loading.spinner',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/loading/spinner'),
                    title: 'Spinner',
                    transKey: 'nav.components.loading.spinner',
                },
            ]
        },
        {
            id: 'components.feedback',
            type: NAV_TYPE_COLLAPSE,
            path: path(ROOT_COMPONENTS, '/feedback'),
            title: 'Feedback',
            transKey: 'nav.components.feedback.feedback',
            Icon: InfoIcon,
            childs: [
                {
                    id: 'components.feedback.tooltip',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/feedback/tooltip'),
                    title: 'Tooltip',
                    transKey: 'nav.components.feedback.tooltip',
                },
                {
                    id: 'components.feedback.notification',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/feedback/notification'),
                    title: 'Notification',
                    transKey: 'nav.components.feedback.notification',
                },
                {
                    id: 'components.feedback.alert',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/feedback/alert'),
                    title: 'Alert',
                    transKey: 'nav.components.feedback.alert',
                },
            ]
        },
        {
            id: 'components.modal',
            type: NAV_TYPE_COLLAPSE,
            path: path(ROOT_COMPONENTS, '/modal'),
            title: 'Modal',
            transKey: 'nav.components.modal.modal',
            Icon: ModalIcon,
            childs: [
                {
                    id: 'components.modal.modal',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/modal/modal'),
                    title: 'Modal',
                    transKey: 'nav.components.modal.modal',
                },
                {
                    id: 'components.modal.drawer',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/modal/drawer'),
                    title: 'Drawer',
                    transKey: 'nav.components.modal.drawer',
                },
            ]
        },
        {
            id: 'components.advanced',
            type: NAV_TYPE_COLLAPSE,
            path: path(ROOT_COMPONENTS, '/advanced'),
            title: 'Advanced',
            transKey: 'nav.components.advanced.advanced',
            Icon: OnboardingIcon,
            childs: [
                {
                    id: 'components.scroll-shadow',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/advanced/scroll-shadow'),
                    title: 'Scroll Shadow',
                    transKey: 'nav.components.advanced.scroll-shadow',
                },
                {
                    id: 'components.charts',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/advanced/charts'),
                    title: 'Charts',
                    transKey: 'nav.components.advanced.charts',
                },
                {
                    id: 'components.carousel',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_COMPONENTS, '/advanced/carousel'),
                    title: 'Carousel',
                    transKey: 'nav.components.advanced.carousel',
                },
            ]
        },
    ]
}
