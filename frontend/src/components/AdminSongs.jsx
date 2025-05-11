import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminSongs = () => {
  const [songs, setSongs] = useState([]);
  const audioRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/songs/");
      // Sắp xếp bài hát theo created_at từ mới nhất
      const sortedSongs = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setSongs(sortedSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handlePlay = (id) => {
    Object.entries(audioRefs.current).forEach(([songId, audioEl]) => {
      if (songId !== String(id) && audioEl && !audioEl.paused) {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
    });

    const currentAudio = audioRefs.current[id];
    if (currentAudio) {
      currentAudio.play();
    }
  };

  const handleDeleteSong = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá bài hát này?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/songs/${id}/`);
      fetchSongs();
    } catch (err) {
      console.error("Error deleting song:", err);
      alert("Error deleting song");
    }
  };

  return (
    <div className="p-4 h-[100%] text-white rounded-lg bg-[#121212]">
      <div className="relative mb-4">
        <h1 className="text-3xl font-bold text-green-500 text-center">Song Management</h1>
        <button
          onClick={() => navigate("/useradmin/api/songs/new")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
        >
          Thêm
        </button>
      </div>

      <div className="overflow-x-auto bg-[#1e1e1e] rounded-lg">
        <table className="min-w-full table-auto border-collapse text-sm text-white">
          <thead className="bg-[#2d2d2d] text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Album</th>
              <th className="px-4 py-2 text-left">Artists</th>
              <th className="px-4 py-2 text-left">Audio</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id} className="border-t border-gray-600 hover:bg-[#2a2a2a]">
                <td className="px-4 py-2">
                  {song.image_url ? (
                    <img src={song.image_url} alt={song.title} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded" />
                  )}
                </td>
                <td className="px-4 py-2">{song.title}</td>
                <td className="px-4 py-2">{song.album?.title || "N/A"}</td>
                <td className="px-4 py-2">
                  {(song.artists || []).map((artist, index) => (
                    <span key={index}>{artist.name || artist}</span>
                  ))}
                </td>
                <td className="px-4 py-2">
                  {song.audio_file ? (
                    <audio
                      ref={(el) => (audioRefs.current[song.id] = el)}
                      controls
                      className="w-45"
                      onPlay={() => handlePlay(song.id)}
                    >
                      <source src={song.audio_file} type="audio/mpeg" />
                      Trình duyệt không hỗ trợ audio.
                    </audio>
                  ) : (
                    <span className="text-gray-500">No audio</span>
                  )}
                </td>
                <td className="px-4 py-2">{formatDuration(song.duration)}</td>
                <td className="px-4 py-2">{new Date(song.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => navigate(`/useradmin/api/songs/${song.id}`)}
                    className="bg-yellow-500 px-2 py-1 rounded text-black text-xs"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteSong(song.id)}
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

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
};

export default AdminSongs;
