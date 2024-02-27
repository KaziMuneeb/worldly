import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";
export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("kazi@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (!(email && password)) return;
    login(email, password);
  }

  useEffect(
    function () {
      if (isAuthenticated === true) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );
  return (
    <main className={styles.login}>
      <Navbar />
      <form className={styles.form} onSubmit={(e) => handleLogin(e)}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type={"primary"}>Login</Button>
        </div>
      </form>
    </main>
  );
}
