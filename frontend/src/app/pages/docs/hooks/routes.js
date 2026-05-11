import { lazy } from 'react';

export const routes = [
    {
        label: 'useBoxPosition',
        path: 'useBoxPosition',
        Component: lazy(() => import('./components/useBoxPosition')),
    },
    {
        label: 'useBoxSize',
        path: 'useBoxSize',
        Component: lazy(() => import('./components/useBoxSize')),
    },
    {
        label: 'useClipboard',
        path: 'useClipboard',
        Component: lazy(() => import('./components/useClipboard')),
    },
    {
        label: 'useCollapse',
        path: 'useCollapse',
        Component: lazy(() => import('./components/useCollapse')),
    },
    {
        label: 'useDataScrollOverflow',
        path: 'useDataScrollOverflow',
        Component: lazy(() => import('./components/useDataScrollOverflow')),
    },
    {
        label: 'useDidUpdate',
        path: 'useDidUpdate',
        Component: lazy(() => import('./components/useDidUpdate')),
    },
    {
        label: 'useDisclosure',
        path: 'useDisclosure',
        Component: lazy(() => import('./components/useDisclosure')),
    },
    {
        label: 'useDocumentTitle',
        path: 'useDocumentTitle',
        Component: lazy(() => import('./components/useDocumentTitle')),
    },
    {
        label: 'useEventCallback',
        path: 'useEventCallback',
        Component: lazy(() => import('./components/useEventCallback')),
    },
    {
        label: 'useEventListener',
        path: 'useEventListener',
        Component: lazy(() => import('./components/useEventListener')),
    },
    {
        label: 'useFuse',
        path: 'useFuse',
        Component: lazy(() => import('./components/useFuse')),
    },
    {
        label: 'useHighlight',
        path: 'useHighlight',
        Component: lazy(() => import('./components/useHighlight')),
    },
    {
        label: 'useHover',
        path: 'useHover',
        Component: lazy(() => import('./components/useHover')),
    },
    {
        label: 'useId',
        path: 'useId',
        Component: lazy(() => import('./components/useId')),
    },
    {
        label: 'useIsomorphicEffect',
        path: 'useIsomorphicEffect',
        Component: lazy(() => import('./components/useIsomorphicEffect')),
    },
    {
        label: 'useListState',
        path: 'useListState',
        Component: lazy(() => import('./components/useListState')),
    },
    {
        label: 'useLocalStorage',
        path: 'useLocalStorage',
        Component: lazy(() => import('./components/useLocalStorage')),
    },
    {
        label: 'useLockScrollbar',
        path: 'useLockScrollbar',
        Component: lazy(() => import('./components/useLockScrollbar')),
    },
    {
        label: 'useMediaQuery',
        path: 'useMediaQuery',
        Component: lazy(() => import('./components/useMediaQuery')),
    },
    {
        label: 'useMergedRef',
        path: 'useMergedRef',
        Component: lazy(() => import('./components/useMergedRef')),
    },
    {
        label: 'useToggle',
        path: 'useToggle',
        Component: lazy(() => import('./components/useToggle')),
    },
    {
        label: 'useUncontrolled',
        path: 'useUncontrolled',
        Component: lazy(() => import('./components/useUncontrolled')),
    },
    {
        label: 'useUnmount',
        path: 'useUnmount',
        Component: lazy(() => import('./components/useUnmount')),
    },
];
