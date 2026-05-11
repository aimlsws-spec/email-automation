import { lazy } from 'react';

export const routes = [
    {
        label: 'AnimatedTick',
        path: 'animated-tick',
        Component: lazy(() => import('./components/AnimatedTickExamples')),
    },
    {
        label: 'ApplyWrapper',
        path: 'apply-wrapper',
        Component: lazy(() => import('./components/ApplyWrapperExamples')),
    },
    {
        label: 'Breadcrumbs',
        path: 'breadcrumbs',
        Component: lazy(() => import('./components/BreadcrumbsExamples')),
    },
    {
        label: 'CollapsibleSearch',
        path: 'collapsible-search',
        Component: lazy(() => import('./components/CollapsibleSearchExamples')),
    },
    {
        label: 'Delayed',
        path: 'delayed',
        Component: lazy(() => import('./components/DelayedExample')),
    },
    {
        label: 'Highlight',
        path: 'hightlight',
        Component: lazy(() => import('./components/HighlightExample')),
    },
    {
        label: 'Page',
        path: 'page',
        Component: lazy(() => import('./components/PageExample')),
    },
    {
        label: 'PreviewImage',
        path: 'preview-image',
        Component: lazy(() => import('./components/PreviewImageExample')),
    },
    {
        label: 'SyntaxHightlighter',
        path: 'syntax-hightlighter',
        Component: lazy(() => import('./components/SyntaxHightlighterExample')),
    },
]
