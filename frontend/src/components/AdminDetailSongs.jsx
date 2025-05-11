import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

// ... giữ nguyên phần import như cũ

const AdminDetailSongs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "",
    audio_file_url: "",
  });

  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetchArtists();
    fetchAlbums();
    if (isEdit) {
      fetchSongDetail();
    }
  }, [isEdit, id]);

  const fetchArtists = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/artists/");
      setArtists(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách nghệ sĩ:", err);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/albums/");
      setAlbums(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách album:", err);
    }
  };

  const fetchSongDetail = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/songs/${id}/`);
      const { image_url, audio_file, ...rest } = res.data;
      setSongData({
        title: rest.title ?? "",
        artist: Array.isArray(rest.artists) && rest.artists[0]?.id ? String(rest.artists[0].id) : "",
        album: rest.album?.id ? String(rest.album.id) : "",
        duration: rest.duration ?? "",
        audio_file_url: audio_file ?? "",
      });
      setPreviewImage(image_url);
    } catch (error) {
      console.error("Lỗi lấy chi tiết bài hát:", error);
      alert("Không tìm thấy bài hát.");
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", songData.title);
    formData.append("duration", songData.duration);

    if (songData.artist) {
      formData.append("artists", Number(songData.artist));
    }

    if (songData.album) {
      formData.append("album", songData.album);
    }

    if (audioFile) {
      formData.append("audio_file", audioFile);
    }

    if (imageFile) {
      formData.append("image_url", imageFile);
    }

    try {
      if (isEdit) {
        await axios.patch(`http://127.0.0.1:8000/api/songs/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cập nhật bài hát thành công.");
      } else {
        await axios.post("http://127.0.0.1:8000/api/songs/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm bài hát thành công.");
      }
      navigate("/useradmin/api/songs");
    } catch (error) {
      console.error("Lỗi khi lưu bài hát:", error.response?.data || error);
      alert("Lỗi khi lưu bài hát.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Vui lòng chọn ảnh nhỏ hơn 10MB");
        return;
      }
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        alert("Vui lòng chọn file âm thanh nhỏ hơn 30MB");
        return;
      }
      setAudioFile(file);
    }
  };

  return (
    <div className="p-2 h-full bg-gradient-to-t from-green-300 to-zinc-700 flex items-center justify-center rounded">
      <div className="bg-zinc-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative">
        <h2 className="text-3xl font-bold text-center mb-4">
          {isEdit ? "Chỉnh sửa bài hát" : "Thêm bài hát mới"}
        </h2>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Tên bài hát</label>
              <input
                type="text"
                value={songData.title}
                onChange={(e) => setSongData({ ...songData, title: e.target.value })}
                className="w-full bg-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="Nhập tên bài hát..."
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Nghệ sĩ</label>
              <select
                value={songData.artist}
                onChange={(e) => setSongData({ ...songData, artist: e.target.value })}
                className="w-full bg-zinc-700 p-3 rounded-xl text-white"
              >
                <option value="">-- Chọn nghệ sĩ --</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Album</label>
              <select
                value={songData.album}
                onChange={(e) => setSongData({ ...songData, album: e.target.value })}
                className="w-full bg-zinc-700 p-3 rounded-xl text-white"
              >
                <option value="">-- Chọn album --</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Thời lượng (giây)</label>
              <input
                type="number"
                value={songData.duration}
                onChange={(e) => setSongData({ ...songData, duration: e.target.value })}
                className="w-full bg-zinc-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition"
                placeholder="Thời lượng bài hát (s)..."
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">File âm thanh</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="w-full text-white"
              />
              {songData.audio_file_url && !audioFile && (
                <audio
                  controls
                  src={songData.audio_file_url}
                  className="mt-2 w-full rounded"
                />
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="bg-green-400 hover:bg-green-300 text-black font-semibold py-2 px-6 rounded-xl transition-all"
              >
                Lưu
              </button>
              <button
                onClick={() => navigate("/useradmin/api/songs")}
                className="bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-2 px-6 rounded-xl transition-all"
              >
                Huỷ
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <label className="relative w-40 h-40 rounded-xl overflow-hidden border-4 border-zinc-600 shadow-md mb-3 group cursor-pointer">
              <img
                src={previewImage || assets.song_icon}
                alt="Ảnh bài hát"
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
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-400">Ảnh bài hát</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailSongs;

