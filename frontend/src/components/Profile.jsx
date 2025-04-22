import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constans";

function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        });
        setUser(res.data);
        setFullName(res.data.last_name || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("last_name", fullName);
      if (avatarFile) formData.append("avatar", avatarFile);

      await api.put("/api/profile/update/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Cập nhật thất bại!");
    }
  };

  if (!user) return <div className="text-white text-center py-10">Đang tải hồ sơ...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg max-w-md w-full relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">&times;</button>

        <h2 className="text-2xl font-bold mb-6">Profile details</h2>

        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="relative group">
            <img
              src={previewAvatar || "https://i.imgur.com/JZQ8g6n.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
            />
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full text-sm">
              <span>Choose photo</span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <button
            onClick={() => {
              setAvatarFile(null);
              setPreviewAvatar(null);
            }}
            className="text-sm text-red-400 hover:underline"
          >
            Remove photo
          </button>
</div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-zinc-800 p-3 rounded text-white placeholder-gray-400"
              placeholder="Họ và tên"
            />
          </div>

          <div>
            <input
              type="text"
              value={user.username}
              readOnly
              className="w-full bg-zinc-800 p-3 rounded text-gray-400"
            />
          </div>

          <div>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full bg-zinc-800 p-3 rounded text-gray-400"
            />
          </div>

          <div>
            <input
              type="text"
              value={user.is_premium ? "Có gói Premium" : "Chưa có Premium"}
              readOnly
              className="w-full bg-zinc-800 p-3 rounded text-gray-400"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-white text-black font-semibold py-2 rounded-full mt-4 hover:bg-gray-200"
          >
            Save
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
        Bằng cách tiến hành, bạn đồng ý cung cấp quyền truy cập Spotify vào hình ảnh bạn chọn để tải lên. Hãy chắc chắn rằng bạn có quyền tải lên hình ảnh.
        </p>
      </div>
    </div>
  );
}

export default Profile;