import { Outlet } from "react-router-dom";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";
function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
    </div>
  );
}

export default Sidebar;
