import { useEffect, useReducer } from "react";
import PropTypes from "prop-types";

import axios from "utils/axios";
import { isTokenValid, setSession } from "utils/jwt";
import { AuthContext } from "./context";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return { ...state, isAuthenticated, isInitialized: true, user };
  },
  LOGIN_REQUEST: (state) => ({ ...state, isLoading: true }),
  LOGIN_SUCCESS: (state, action) => ({
    ...state,
    isAuthenticated: true,
    isLoading: false,
    user: action.payload.user,
  }),
  LOGIN_ERROR: (state, action) => ({
    ...state,
    errorMessage: action.payload.errorMessage,
    isLoading: false,
  }),
  LOGOUT: (state) => ({ ...state, isAuthenticated: false, user: null }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = window.localStorage.getItem("authToken");
        if (authToken && isTokenValid(authToken)) {
          setSession(authToken);
          const response = await axios.get("/api/auth/profile");
          const user = response.data?.responsedata;
          if (user) {
            dispatch({
              type: "INITIALIZE",
              payload: { isAuthenticated: true, user },
            });
            return;
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      }
      dispatch({
        type: "INITIALIZE",
        payload: { isAuthenticated: false, user: null },
      });
    };
    init();
  }, []);

  const login = async ({ username, password, rememberMe }) => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const response = await axios.post("/api/auth/login", {
        email: username,
        password,
        rememberMe: !!rememberMe,
      });
      const { authToken, responsedata } = response.data;
      setSession(authToken);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: responsedata },
      });
      return { success: true };
    } catch (err) {
      const message = err?.message || "Invalid email or password";
      dispatch({
        type: "LOGIN_ERROR",
        payload: { errorMessage: message },
      });
      return { success: false, message };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      return { success: true, message: response.data?.message };
    } catch (err) {
      const message = err?.message || "Registration failed";
      return { success: false, message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      return { success: true, message: response.data?.message };
    } catch (err) {
      const message = err?.message || "Failed to send reset email";
      return { success: false, message };
    }
  };

  const resetPassword = async ({ token, password }) => {
    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      return { success: true, message: response.data?.message };
    } catch (err) {
      const message = err?.message || "Failed to reset password";
      return { success: false, message };
    }
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  if (!children) return null;

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
