import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Kazi Muneeb",
  email: "kazi@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Ivalid action detected!");
  }
}
function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }
  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ logout, login, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!AuthContext) throw new Error("AuthContext is used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
