import { useState } from "react";

export default function AuthModal({ onClose, setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    const url = isLogin
      ? "https://experience-u2rf.onrender.com/api/auth/login"
      : "https://experience-u2rf.onrender.com/api/auth/register";

    const payload = isLogin
      ? { email: form.email, password: form.password }
      : form;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Invalid credentials");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);

    // Force reload to refresh Dashboard with new user data
    window.location.reload();
    onClose();
  };

  return (
    <div className="auth-overlay">
      <div className="auth-glass">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            placeholder="Username"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        )}

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {error && <p className="error-text">{error}</p>}

        <button className="auth-submit-btn" onClick={submit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="switch-auth"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Already have an account?"}
        </p>
      </div>
    </div>
  );
}
