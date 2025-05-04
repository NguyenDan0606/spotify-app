import { Routes, Navigate, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import UserAdmin from "./pages/UserAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSongs from "./components/AdminSongs";
import AdminDisplay from "./components/AdminDisplay";
import AdminUsers from "./components/AdminUsers";
import AdminDetailUser from "./components/AdminDetailUser";
import Unauthorized from "./pages/Unauthorized";
import { useUser } from "./context/UserContext";
import { useEffect } from "react";

function Logout() {
  const [, setUser] = useUser();
  useEffect(() => {
    localStorage.clear();
    setUser(null);
  }, [setUser]);
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return <Register />;
}

const App = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<RegisterAndLogout />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/useradmin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <UserAdmin />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDisplay selectedMenu="" />} />
        <Route path="api/songs" element={<AdminSongs />} />
        <Route path="api/users" element={<AdminUsers />} />
        <Route path="api/users/new" element={<AdminDetailUser mode="create" />} />
        <Route path="api/users/:id" element={<AdminDetailUser mode="edit" />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
