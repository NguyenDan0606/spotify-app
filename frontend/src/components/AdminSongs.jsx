import { useEffect, useState, useRef } from "react";
import axios from "axios";

const AdminSongs = () => {
  const [songs, setSongs] = useState([]);
  const audioRefs = useRef({}); // Lưu trữ tất cả audio elements theo id bài hát

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/songs/");
        setSongs(res.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  const handlePlay = (id) => {
    // Dừng tất cả audio khác
    Object.entries(audioRefs.current).forEach(([songId, audioEl]) => {
      if (songId !== String(id) && audioEl && !audioEl.paused) {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
    });

    // Play bài hiện tại nếu chưa phát
    const currentAudio = audioRefs.current[id];
    if (currentAudio) {
      currentAudio.play();
    }
  };

  return (
    <div className="p-2 rounded-lg bg-[#121212]">
      <h1 className="text-3xl font-bold mb-4 text-green-500 text-center">Song Management</h1>
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
