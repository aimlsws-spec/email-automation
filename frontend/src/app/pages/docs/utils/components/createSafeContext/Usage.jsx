import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { createSafeContext } from "utils/createSafeContext";

const [AuthProvider, useAuth] = createSafeContext("useAuth must be used within AuthProvider");

function App() {
    return (
        <AuthProvider value={{ user: "John Doe", isAuthenticated: true }}>
            <Dashboard />
        </AuthProvider>
    );
}

function Dashboard() {
    const auth = useAuth();
    return <div>Welcome, {auth.user}</div>;
}`}</SyntaxHighlighter>
    </div>
  );
}
