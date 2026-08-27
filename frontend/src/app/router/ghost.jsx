import GhostGuard from "middleware/GhostGuard";

const ghostRoutes = {
  id: "ghost",
  Component: GhostGuard,
  children: [
    {
      path: "login",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/LoginPage")).default,
      }),
    },
    {
      path: "sign-up",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/SignUpPage")).default,
      }),
    },
    {
      path: "forgot-password",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/ForgotPasswordPage")).default,
      }),
    },
    {
      path: "reset-password",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/ResetPasswordPage")).default,
      }),
    },
  ],
};

export { ghostRoutes };
