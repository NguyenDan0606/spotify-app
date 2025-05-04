import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets"; // dùng hình ảnh mặc định nếu cần

const AdminDetailUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    last_name: "",
    is_premium: false,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchUserDetail();
    }
  }, [isEdit, id]);

  const fetchUserDetail = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`);
      const { avatar, ...rest } = res.data;
      setUserData({ ...rest, password: "" });
      setPreviewAvatar(avatar);
      
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Không tìm thấy user.");
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    for (let key in userData) {
      // Nếu là password mà rỗng => bỏ qua
      if (key === "password" && userData[key].trim() === "") continue;
      formData.append(key, userData[key]);
    }
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      if (isEdit) {
        await axios.patch(`http://127.0.0.1:8000/api/users/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cập nhật thành công.");
      } else {
        await axios.post("http://127.0.0.1:8000/api/users/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm user thành công.");
      }
      navigate("/useradmin/api/users");
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Lỗi khi lưu user.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Vui lòng chọn ảnh nhỏ hơn 10MB");
        e.target.value = null;
        return;
      }
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="h-full bg-gradient-to-t from-green-300 to-zinc-700 flex items-center justify-center px-4 rounded-lg">
      <div className="bg-zinc-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        </h2>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-4">
            {/* Username */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Tên người dùng</label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                className="w-full bg-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="Nhập username..."
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full bg-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="Nhập email..."
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Mật khẩu</label>
              <input
                type="password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                className="w-full bg-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="Đặt lại mật khẩu..."
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Họ và tên</label>
              <input
                type="text"
                value={userData.last_name}
                onChange={(e) =>
                  setUserData({ ...userData, last_name: e.target.value })
                }
                className="w-full bg-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="Nhập họ tên..."
              />
            </div>

            {/* Premium */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={userData.is_premium}
                onChange={(e) =>
                  setUserData({ ...userData, is_premium: e.target.checked })
                }
              />
              <label className="text-sm text-gray-300">Tài khoản Premium</label>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Vai trò</label>
              <select
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                className="w-full bg-zinc-700 p-3 rounded-xl text-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="bg-green-400 hover:bg-green-300 text-black font-semibold py-2 px-6 rounded-xl transition-all"
              >
                Lưu
              </button>
              <button
                onClick={() => navigate("/useradmin/api/users")}
                className="bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-2 px-6 rounded-xl transition-all"
              >
                Huỷ
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center justify-center">
            <label className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-zinc-600 shadow-md mb-3 group cursor-pointer">
              <img
                src={previewAvatar || assets.user_icon}
                alt="avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 000-1.414l-2.586-2.586a1 1 0 00-1.414 0L3 21z"
                  />
                </svg>
                <span className="text-white text-sm">Chọn ảnh</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-400">Ảnh đại diện</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Vui lòng đảm bảo bạn có quyền sử dụng hình ảnh đại diện đã tải lên.
        </p>
      </div>
    </div>
  );
};

export default AdminDetailUser;
