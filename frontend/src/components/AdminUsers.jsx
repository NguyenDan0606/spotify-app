import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/");
      // Sắp xếp người dùng theo ID từ lớn đến nhỏ
      const sortedUsers = res.data.sort((a, b) => b.id - a.id);
      setUsers(sortedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`);
      fetchUsers(); // Refresh danh sách
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Error deleting user");
    }
  };

  return (
    <div className="p-4 h-[100%] text-white rounded-lg bg-[#121212]">
      <div className="relative mb-4">
        <h1 className="text-3xl font-bold text-green-500 text-center">User Management</h1>
        <button
          onClick={() => navigate("/useradmin/api/users/new")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
        >
          Thêm
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm border-collapse">
          <thead className="bg-[#2c2c2c] text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Fullname</th>
              <th className="px-4 py-2 text-left">Premium</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-600 hover:bg-[#2a2a2a]"
              >
                <td className="px-4 py-2">{user.id}</td> {/* Hiển thị ID */}
                <td className="px-4 py-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-700 rounded-full" />
                  )}
                </td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.last_name}</td>
                <td className="px-4 py-2">
                  {user.is_premium ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/useradmin/api/users/${user.id}`)
                    }
                    className="bg-yellow-500 px-2 py-1 rounded text-black text-xs"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 px-2 py-1 rounded text-white text-xs"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
