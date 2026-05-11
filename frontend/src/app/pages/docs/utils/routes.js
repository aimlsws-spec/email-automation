import { lazy } from 'react';

export const routes = [
    {
        label: 'createScopedKeydownHandler',
        path: 'createScopedKeydownHandler',
        Component: lazy(() => import('./components/createScopedKeydownHandler')),
    },
    {
        label: 'detectDeviceType',
        path: 'detectDeviceType',
        Component: lazy(() => import('./components/detectDeviceType')),
    },
    {
        label: 'detectTouch',
        path: 'detectTouch',
        Component: lazy(() => import('./components/detectTouch')),
    },
    {
        label: 'getScrollbarWidth',
        path: 'getScrollbarWidth',
        Component: lazy(() => import('./components/getScrollbarWidth')),
    },
    {
        label: 'getUserAgentBrowser',
        path: 'getUserAgentBrowser',
        Component: lazy(() => import('./components/getUserAgentBrowser')),
    },
    {
        label: 'getUserAgentOS',
        path: 'getUserAgentOS',
        Component: lazy(() => import('./components/getUserAgentOS')),
    },
    {
        label: 'injectStylesToHead',
        path: 'injectStylesToHead',
        Component: lazy(() => import('./components/injectStylesToHead')),
    },
    {
        label: 'isRef',
        path: 'isRef',
        Component: lazy(() => import('./components/isRef')),
    },
    {
        label: 'triggerPostMoveFlash',
        path: 'triggerPostMoveFlash',
        Component: lazy(() => import('./components/triggerPostMoveFlash')),
    },
    {
        label: 'unRef',
        path: 'unRef',
        Component: lazy(() => import('./components/unRef')),
    },
    {
        label: 'colorFromText',
        path: 'colorFromText',
        Component: lazy(() => import('./components/colorFromText')),
    },
    {
        label: 'compareArrays',
        path: 'compareArrays',
        Component: lazy(() => import('./components/compareArrays')),
    },
    {
        label: 'createSafeContext',
        path: 'createSafeContext',
        Component: lazy(() => import('./components/createSafeContext')),
    },
    {
        label: 'ensureString',
        path: 'ensureString',
        Component: lazy(() => import('./components/ensureString')),
    },
    {
        label: 'formatBytes',
        path: 'formatBytes',
        Component: lazy(() => import('./components/formatBytes')),
    },
    {
        label: 'formatNumber',
        path: 'formatNumber',
        Component: lazy(() => import('./components/formatNumber')),
    },
    {
        label: 'getMultipleRandom',
        path: 'getMultipleRandom',
        Component: lazy(() => import('./components/getMultipleRandom')),
    },
    {
        label: 'isRouteActive',
        path: 'isRouteActive',
        Component: lazy(() => import('./components/isRouteActive')),
    },
    {
        label: 'isServer',
        path: 'isServer',
        Component: lazy(() => import('./components/isServer')),
    },
    {
        label: 'jwt',
        path: 'jwt',
        Component: lazy(() => import('./components/jwt')),
    },
    {
        label: 'msToTime',
        path: 'msToTime',
        Component: lazy(() => import('./components/msToTime')),
    },
    {
        label: 'htmlToDelta',
        path: 'htmlToDelta',
        Component: lazy(() => import('./components/htmlToDelta')),
    },
    {
        label: 'isDeltaNotEmpty',
        path: 'isDeltaNotEmpty',
        Component: lazy(() => import('./components/isDeltaNotEmpty')),
    },
    {
        label: 'randomId',
        path: 'randomId',
        Component: lazy(() => import('./components/randomId')),
    },
    {
        label: 'range',
        path: 'range',
        Component: lazy(() => import('./components/range')),
    },
    {
        label: 'setThisClass',
        path: 'setThisClass',
        Component: lazy(() => import('./components/setThisClass')),
    },
    {
        label: 'stringToSlug',
        path: 'stringToSlug',
        Component: lazy(() => import('./components/stringToSlug')),
    },
];
