// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
// import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards/email-analytics" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/email-analytics" />,
            },
            {
              path: "email-analytics",
              children: [
                {
                  index: true,
                  lazy: async () => ({
                    Component: (await import("app/pages/dashboards/email-analytics")).default,
                  }),
                },
                {
                  path: "campaign/:id",
                  lazy: async () => ({
                    Component: (await import("app/pages/dashboards/email-analytics/CampaignDetails")).default,
                  }),
                },
              ],
            },
            {
              path: "send-emails",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/send-email")).default,
              }),
            },
            {
              path: "send-email",
              element: <Navigate to="/dashboards/send-emails" replace />,
            },
            // { path: "crm-analytics", lazy: async () => ({ Component: (await import("app/pages/dashboards/crm-analytics")).default }) },
            // { path: "orders", lazy: async () => ({ Component: (await import("app/pages/dashboards/orders")).default }) },
            // { path: "crypto/crypto-1", lazy: async () => ({ Component: (await import("app/pages/dashboards/crypto-1")).default }) },
            // { path: "crypto/crypto-2", lazy: async () => ({ Component: (await import("app/pages/dashboards/crypto-2")).default }) },
            // { path: "banking/banking-1", lazy: async () => ({ Component: (await import("app/pages/dashboards/banking-1")).default }) },
            // { path: "banking/banking-2", lazy: async () => ({ Component: (await import("app/pages/dashboards/banking-2")).default }) },
            // { path: "personal", lazy: async () => ({ Component: (await import("app/pages/dashboards/personal")).default }) },
            // { path: "cms-analytics", lazy: async () => ({ Component: (await import("app/pages/dashboards/cms-analytics")).default }) },
            // { path: "influencer", lazy: async () => ({ Component: (await import("app/pages/dashboards/influencer")).default }) },
            // { path: "teacher", lazy: async () => ({ Component: (await import("app/pages/dashboards/teacher")).default }) },
            // { path: "travel", lazy: async () => ({ Component: (await import("app/pages/dashboards/travel")).default }) },
            // { path: "education", lazy: async () => ({ Component: (await import("app/pages/dashboards/education")).default }) },
            // { path: "authors", lazy: async () => ({ Component: (await import("app/pages/dashboards/authors")).default }) },
            // { path: "doctor", lazy: async () => ({ Component: (await import("app/pages/dashboards/doctor")).default }) },
            // { path: "employees", lazy: async () => ({ Component: (await import("app/pages/dashboards/employees")).default }) },
            // { path: "workspaces", lazy: async () => ({ Component: (await import("app/pages/dashboards/workspaces")).default }) },
            // { path: "meetings", lazy: async () => ({ Component: (await import("app/pages/dashboards/meetings")).default }) },
            // { path: "projects-board", lazy: async () => ({ Component: (await import("app/pages/dashboards/projects-board")).default }) },
            // { path: "widget-ui", lazy: async () => ({ Component: (await import("app/pages/dashboards/widget-ui")).default }) },
            // { path: "widget-contact", lazy: async () => ({ Component: (await import("app/pages/dashboards/widget-contact")).default }) },
          ],
        },
        // ── components, forms, tables, prototypes, apps, Docs all commented out ──
        // { path: "/components", children: [ ... ] },
        // { path: "/forms", children: [ ... ] },
        // { path: "/tables", children: [ ... ] },
        // { path: "/prototypes", children: [ ... ] },
        // { path: "apps", children: [ ... ] },
        // { path: "Docs", children: [ ... ] },
      ],
    },
    // AppLayout routes (pos, filemanager, chat, ai-chat, mail, todo, kanban, settings) — commented out
    // {
    //   Component: AppLayout,
    //   children: [ ... ],
    // },
  ],
};

export { protectedRoutes };
