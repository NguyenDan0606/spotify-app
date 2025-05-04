import { useEffect, useState } from "react";
import api from "../api";
import { assets } from "../assets/assets";
import { ACCESS_TOKEN } from "../constans";
import { useUser } from "../context/UserContext";

function Profile() {
  const [user, setUser, fetchUser] = useUser(); // ✅ thêm fetchUser
  const [lastName, setLastName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    if (!user) {
      fetchUser(); // ✅ gọi fetchUser nếu chưa có user
    }
  }, [user, fetchUser]);

  useEffect(() => {
    if (user) {
      setLastName(user.last_name ?? "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setIsDirty(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Vui lòng chọn ảnh nhỏ hơn 10MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("last_name", lastName);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await api.patch("/api/profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Cập nhật hồ sơ thành công!");
      setUser(res.data);
      localStorage.setItem("avatar", res.data.avatar);
    } catch (error) {
      console.error("Update error:", error);
      alert("Cập nhật thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="text-white text-center py-10">Đang tải hồ sơ...</div>;
  }

  return (
    <div className="h-full bg-gradient-to-t from-green-300 to-zinc-700 flex items-center justify-center px-4">
      <div className="bg-zinc-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative">
        <h2 className="text-3xl font-bold text-center mb-6">Thông tin hồ sơ</h2>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Họ và tên</label>
              <input
                type="text"
                value={lastName}
                onChange={handleLastNameChange}
                className="w-full bg-zinc-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="Nhập họ tên..."
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Tên người dùng</label>
              <input
                type="text"
                value={user.username}
                readOnly
                className="w-full bg-zinc-700 p-3 rounded-xl text-gray-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full bg-zinc-700 p-3 rounded-xl text-gray-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Trạng thái gói</label>
              <input
                type="text"
                readOnly
                value={user.is_premium ? "✅ Đang dùng Premium" : "❌ Chưa đăng ký"}
                className="w-full bg-zinc-700 p-3 rounded-xl text-gray-400"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={`w-full py-3 mt-4 rounded-xl font-bold transition-all duration-300 ${
                isDirty
                  ? "bg-green-400 text-black hover:bg-green-300"
                  : "bg-zinc-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <label className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-zinc-600 shadow-md mb-3 group cursor-pointer">
              <img
                src={avatarPreview || assets.user_icon}
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
            <span className="text-sm text-gray-400">Chọn ảnh đại diện mới</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Bằng cách tiếp tục, bạn đồng ý chia sẻ hình ảnh đại diện nếu có. Vui lòng đảm bảo bạn có quyền sử dụng hình ảnh.
        </p>
      </div>
    </div>
  );
}

export default Profile;
