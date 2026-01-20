import { useState } from "react";
import AuthModal from "./AuthModal";

export default function AuthProfile() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u && u !== "undefined" ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });
  const [showAuth, setShowAuth] = useState(false);
  const [photo, setPhoto] = useState(
    localStorage.getItem("profilePhoto")
  );
  const [openMenu, setOpenMenu] = useState(false);

  // Correction: If we have a token but NO user, we must clear storage so the Login button shows up.
  if (token && !user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  }

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setPhoto(null);
    setOpenMenu(false);

    // Force reload to clear all states (salary, expenses, budgets)
    window.location.reload();
  };

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profilePhoto", reader.result);
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* FIXED LEFT AUTH AREA */}
      <div className="auth-left-fixed">
        {!token && (
          <button
            className="login-btn-glass"
            onClick={() => setShowAuth(true)}
          >
            Login
          </button>
        )}

        {token && user && (
          <>
            <div
              className="profile-avatar-fixed"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {photo ? (
                <img src={photo} alt="Profile" />
              ) : (
                <span>+</span>
              )}
            </div>

            {openMenu && (
              <div className="profile-dropdown-fixed">
                <h4>{user.username}</h4>

                <label className="dropdown-btn">
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={uploadPhoto}
                  />
                </label>

                <button
                  className="dropdown-btn danger"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          setToken={(t) => {
            setToken(t);
            setUser(JSON.parse(localStorage.getItem("user")));
          }}
        />
      )}
    </>
  );
}
