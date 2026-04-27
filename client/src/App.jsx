import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  return fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
}

function AuthForm({ mode, onAuth }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await request(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error || "Request failed");
        return;
      }

      const payload = await res.json();
      onAuth(payload.user);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Request failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Freemium</p>
        <h1>{isLogin ? "Sign in" : "Create account"}</h1>
        <label htmlFor={`${mode}-username`}>Username</label>
        <input
          id={`${mode}-username`}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
        <label htmlFor={`${mode}-password`}>Password</label>
        <input
          id={`${mode}-password`}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isLogin ? "current-password" : "new-password"}
        />
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Working..." : isLogin ? "Login" : "Register"}
        </button>
        <p className="auth-link">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/register" : "/login"}>
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </form>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await request("/api/auth/logout", {
        method: "POST"
      });

      if (!res.ok) {
        setError("Logout failed");
        return;
      }

      onLogout();
      navigate("/login", { replace: true });
    } catch {
      setError("Logout failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>{user.username}</h1>
          </div>
          <button type="button" onClick={handleLogout} disabled={isSubmitting}>
            {isSubmitting ? "Working..." : "Logout"}
          </button>
        </div>
        <p>Your session is active.</p>
        <p>Premium status: {user.isPremium ? "Premium" : "Free"}</p>
        {error ? <p className="form-error">{error}</p> : null}
      </section>
    </main>
  );
}

function ProtectedRoute({ isLoading, user, children }) {
  const location = useLocation();

  if (isLoading) {
    return <main className="status-shell">Loading...</main>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function restoreSession() {
      try {
        const res = await request("/api/auth/me", {
          signal: controller.signal
        });

        if (res.status === 401) {
          setUser(null);
          return;
        }

        if (!res.ok) {
          setUser(null);
          return;
        }

        const payload = await res.json();
        setUser(payload.user);
      } catch (error) {
        if (error.name !== "AbortError") {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <AuthForm mode="login" onAuth={setUser} />}
      />
      <Route
        path="/register"
        element={
          user ? <Navigate to="/dashboard" replace /> : <AuthForm mode="register" onAuth={setUser} />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isLoading={isLoading} user={user}>
            <Dashboard user={user} onLogout={() => setUser(null)} />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
