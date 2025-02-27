import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const { user, handleLogout } = useAuth();

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Outlet />
    </>
  );
};

export default Layout;
