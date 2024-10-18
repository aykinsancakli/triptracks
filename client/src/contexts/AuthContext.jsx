import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL;

const initialState = {
  user: null,
  isAuthenticated: false,
  errors: { email: "", password: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "auth/success":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case "auth/error":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    case "login/success":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        errors: { email: "", password: "" },
      };

    case "login/error":
      return {
        ...state,
        errors: action.payload,
      };

    case "signup/success":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        errors: { email: "", password: "" },
      };

    case "signup/error":
      return {
        ...state,
        errors: action.payload,
      };

    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, errors }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Check auth status on app load
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await fetch(`${BASE_URL}/check-auth`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          if (data.user) {
            dispatch({ type: "auth/success", payload: data.user });
          } else {
            dispatch({ type: "auth/error" });
          }
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: "auth/error" });
      }
    }

    checkAuthStatus();
  }, []);

  async function login(email, password) {
    // Clear errors before attempting login
    dispatch({ type: "login/error", payload: { email: "", password: "" } });

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();

      if (data.errors) {
        dispatch({ type: "login/error", payload: data.errors });
      }

      if (data.user) {
        dispatch({ type: "login/success", payload: data.user });
        return data.user;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function signup(email, password) {
    // Clear errors before attempting signup
    dispatch({ type: "signup/error", payload: { email: "", password: "" } });

    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (data.errors) {
        dispatch({ type: "signup/error", payload: data.errors });
      }

      if (data.user) {
        console.log(data.user);
        dispatch({ type: "signup/success", payload: data.user });
        return data.user;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function logout() {
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Clear user and auth status
      dispatch({ type: "logout" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        errors,
        login,
        signup,
        logout,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

/* eslint-disable-next-line react-refresh/only-export-components */
export { AuthProvider, useAuth };
