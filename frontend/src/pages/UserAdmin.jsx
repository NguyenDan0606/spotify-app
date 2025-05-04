import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

function UserAdmin() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar selectedPath={location.pathname} />
        <div className="w-[80%] h-full p-2 overflow-y-auto text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserAdmin;