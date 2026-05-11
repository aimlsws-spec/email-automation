import PrototypesIcon from 'assets/dualicons/prototypes.svg?react'
import OnboardingIcon from 'assets/nav-icons/onboarding.svg?react'
import UserIcon from 'assets/nav-icons/user.svg?react'
import PeopleEditIcon from 'assets/nav-icons/people-edit.svg?react'
import DocumentEditIcon from 'assets/nav-icons/document.svg?react'
import CurrencyDollarIcon from 'assets/nav-icons/currency-dollar.svg?react'
import QuestionIcon from 'assets/nav-icons/question.svg?react'
import InvoiceIcon from 'assets/nav-icons/invoice.svg?react'
import LoginIcon from 'assets/nav-icons/login.svg?react'
import PeoplePlusIcon from 'assets/nav-icons/people-plus.svg?react'
import ErrorIcon from 'assets/nav-icons/error.svg?react'

import { NAV_TYPE_ROOT, NAV_TYPE_ITEM, NAV_TYPE_COLLAPSE, NAV_TYPE_DIVIDER } from 'constants/app.constant'

const ROOT_PROTOTYPES = '/prototypes';

const path = (root, item) => `${root}${item}`;

export const prototypes = {
    id: 'prototypes',
    type: NAV_TYPE_ROOT,
    path: 'prototypes',
    title: 'Prototypes',
    transKey: 'nav.prototypes.prototypes',
    Icon: PrototypesIcon,
    childs: [
        {
            id: 'prototypes.onboarding',
            path: path(ROOT_PROTOTYPES, '/onboarding'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Onboarding',
            transKey: 'nav.prototypes.onboarding',
            Icon: OnboardingIcon,
            childs: [
                {
                    id: 'prototypes.onboarding-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/onboarding/onboarding-1'),
                    title: 'Onboarding 1',
                    transKey: 'nav.prototypes.onboarding-1',
                    Icon: 'prototypes'
                },
                {
                    id: 'prototypes.onboarding-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/onboarding/onboarding-2'),
                    title: 'Onboarding 2',
                    transKey: 'nav.prototypes.onboarding-2',
                    Icon: 'prototypes'
                },
            ]
        },
        {
            id: 'prototypes.users-card',
            path: path(ROOT_PROTOTYPES, '/users-card'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Users List',
            transKey: 'nav.prototypes.users-card',
            Icon: UserIcon,
            childs: [
                {
                    id: 'prototypes.users-card-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/users-card/users-card-1'),
                    title: 'Users List 1',
                    transKey: 'nav.prototypes.users-card-1',
                },
                {
                    id: 'prototypes.users-card-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/users-card/users-card-2'),
                    title: 'Users List 2',
                    transKey: 'nav.prototypes.users-card-2',
                },
                {
                    id: 'prototypes.users-card-3',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/users-card/users-card-3'),
                    title: 'Users List 3',
                    transKey: 'nav.prototypes.users-card-3',
                },
                {
                    id: 'prototypes.users-card-4',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/users-card/users-card-4'),
                    title: 'Users List 4',
                    transKey: 'nav.prototypes.users-card-4',
                },
                {
                    id: 'prototypes.users-card-5',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/users-card/users-card-5'),
                    title: 'Users List 5',
                    transKey: 'nav.prototypes.users-card-5',
                },
                {
                    id: 'prototypes.users-card-6',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/users-card/users-card-6'),
                    title: 'Users List 6',
                    transKey: 'nav.prototypes.users-card-6',
                },
                {
                    id: 'prototypes.users-card-7',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/users-card/users-card-7'),
                    title: 'Users List 7',
                    transKey: 'nav.prototypes.users-card-7',
                },
            ]
        },
        {
            id: 'prototypes.blog-card',
            path: path(ROOT_PROTOTYPES, '/blog-card'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Blog List',
            transKey: 'nav.prototypes.blog-card',
            Icon: PeopleEditIcon,
            childs: [
                {
                    id: 'prototypes.blog-card-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/blog-card/blog-card-1'),
                    title: 'Blog List 1',
                    transKey: 'nav.prototypes.blog-card-1',
                },
                {
                    id: 'prototypes.blog-card-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/blog-card/blog-card-2'),
                    title: 'Blog List 2',
                    transKey: 'nav.prototypes.blog-card-2',
                },
                {
                    id: 'prototypes.blog-card-3',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/blog-card/blog-card-3'),
                    title: 'Blog List 3',
                    transKey: 'nav.prototypes.blog-card-3',
                },
                {
                    id: 'prototypes.blog-card-4',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/blog-card/blog-card-4'),
                    title: 'Blog List 4',
                    transKey: 'nav.prototypes.blog-card-4',
                },
                {
                    id: 'prototypes.blog-card-5',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/blog-card/blog-card-5'),
                    title: 'Blog List 5',
                    transKey: 'nav.prototypes.blog-card-5',
                },
                {
                    id: 'prototypes.blog-card-6',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/blog-card/blog-card-6'),
                    title: 'Blog List 6',
                    transKey: 'nav.prototypes.blog-card-6',
                },
                {
                    id: 'prototypes.blog-card-7',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/blog-card/blog-card-7'),
                    title: 'Blog List 7',
                    transKey: 'nav.prototypes.blog-card-7',
                },
                {
                    id: 'prototypes.blog-card-8',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/blog-card/blog-card-8'),
                    title: 'Blog List 8',
                    transKey: 'nav.prototypes.blog-card-8',
                },
            ]
        },
        {
            id: 'prototypes.post-details',
            path: path(ROOT_PROTOTYPES, '/post-details'),
            type: NAV_TYPE_ITEM,
            title: 'Post Details',
            transKey: 'nav.prototypes.post-details',
            Icon: DocumentEditIcon,
        },
        {
            id: 'prototypes.price-list',
            path: path(ROOT_PROTOTYPES, '/price-list'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Price List',
            transKey: 'nav.prototypes.price-list',
            Icon: CurrencyDollarIcon,
            childs: [
                {
                    id: 'prototypes.price-list-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/price-list/price-list-1'),
                    title: 'Price List 1',
                    transKey: 'nav.prototypes.price-list-1',
                },
                {
                    id: 'prototypes.price-list-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/price-list/price-list-2'),
                    title: 'Price List 2',
                    transKey: 'nav.prototypes.price-list-2',
                },
                {
                    id: 'prototypes.price-list-3',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/price-list/price-list-3'),
                    title: 'Price List 3',
                    transKey: 'nav.prototypes.price-list-3',
                },
                {
                    id: 'prototypes.price-list-4',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/price-list/price-list-4'),
                    title: 'Price List 4',
                    transKey: 'nav.prototypes.price-list-4',
                },
            ]
        },
        {
            id: 'prototypes.help',
            path: path(ROOT_PROTOTYPES, '/help'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Help',
            transKey: 'nav.prototypes.help',
            Icon: QuestionIcon,
            childs: [
                {
                    id: 'prototypes.help-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/help/help-1'),
                    title: 'Help 1',
                    transKey: 'nav.prototypes.help-1',
                },
                {
                    id: 'prototypes.help-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/help/help-2'),
                    title: 'Help 2',
                    transKey: 'nav.prototypes.help-2',
                },
                {
                    id: 'prototypes.help-3',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/help/help-3'),
                    title: 'Help 3',
                    transKey: 'nav.prototypes.help-3',
                },
            ]
        },
        {
            id: 'prototypes.invoice',
            path: path(ROOT_PROTOTYPES, '/invoice'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Invoice',
            transKey: 'nav.prototypes.invoice',
            Icon: InvoiceIcon,
            childs: [
                {
                    id: 'prototypes.invoice-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/invoice/invoice-1'),
                    title: 'Invoice 1',
                    transKey: 'nav.prototypes.invoice-1',
                },
                {
                    id: 'prototypes.invoice-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/invoice/invoice-2'),
                    title: 'Invoice 2',
                    transKey: 'nav.prototypes.invoice-2',
                },
            ],

        },
        {
            id: 'prototypes.divide-1',
            type: NAV_TYPE_DIVIDER
        },
        {
            id: 'prototypes.sign-in',
            path: path(ROOT_PROTOTYPES, '/sign-in'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Sign In',
            transKey: 'nav.prototypes.sign-in',
            Icon: LoginIcon,
            childs: [
                {
                    id: 'prototypes.sign-in-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/sign-in/sign-in-1'),
                    title: 'Sign In 1',
                    transKey: 'nav.prototypes.sign-in-1',
                },
                {
                    id: 'prototypes.sign-in-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/sign-in/sign-in-2'),
                    title: 'Sign In 2',
                    transKey: 'nav.prototypes.sign-in-2',
                },
            ],

        },
        {
            id: 'prototypes.sign-up',
            path: path(ROOT_PROTOTYPES, '/sign-up'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Sign Up',
            transKey: 'nav.prototypes.sign-up',
            Icon: PeoplePlusIcon,
            childs: [
                {
                    id: 'prototypes.sign-up-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/sign-up/sign-up-1'),
                    title: 'Sign Up 1',
                    transKey: 'nav.prototypes.sign-up-1',
                },
                {
                    id: 'prototypes.sign-up-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/sign-up/sign-up-2'),
                    title: 'Sign Up 2',
                    transKey: 'nav.prototypes.sign-up-2',
                },
            ],

        },
        {
            id: 'prototypes.divide-2',
            type: NAV_TYPE_DIVIDER
        },
        {
            id: 'prototypes.errors',
            path: path(ROOT_PROTOTYPES, '/errors'),
            type: NAV_TYPE_COLLAPSE,
            title: 'Error Pages',
            transKey: 'nav.prototypes.errors',
            Icon: ErrorIcon,
            childs: [
                {
                    id: 'prototypes.error-404-1',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/errors/404-v1'),
                    title: 'Error 404 v1',
                    transKey: 'nav.prototypes.error-404-1',
                },
                {
                    id: 'prototypes.error-404-2',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/errors/404-v2'),
                    title: 'Error 404 v2',
                    transKey: 'nav.prototypes.error-404-2',
                },
                {
                    id: 'prototypes.error-404-3',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/errors/404-v3'),
                    title: 'Error 404 v3',
                    transKey: 'nav.prototypes.error-404-3',
                },
                {
                    id: 'prototypes.error-404-4',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/errors/404-v4'),
                    title: 'Error 404 v4',
                    transKey: 'nav.prototypes.error-404-4',
                },
                {
                    id: 'prototypes.error-401',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/errors/401'),
                    title: 'Error 401',
                    transKey: 'nav.prototypes.error-401',
                },
                {
                    id: 'prototypes.error-429',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/errors/429'),
                    title: 'Error 429',
                    transKey: 'nav.prototypes.error-429',
                },
                {
                    id: 'prototypes.error-500',
                    type: NAV_TYPE_ITEM,
                    path: path(ROOT_PROTOTYPES, '/errors/500'),
                    title: 'Error 500',
                    transKey: 'nav.prototypes.error-500',
                },
            ]
        }
    ]
}
