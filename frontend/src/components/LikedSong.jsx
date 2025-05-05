/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { FaPlay } from "react-icons/fa";
import Footer from "./Footer";
import { useState, useEffect,useContext } from "react";
import { ACCESS_TOKEN } from "../constans";
import { PlayerContext } from "../context/PlayerContext";
const LikedSong = (props) => {


  const handlePlaySongClick=(songID)=> {
    props.setRightPanelVisible(true);
    playWithId(songID);
  }
  const { playWithId } = useContext(PlayerContext);
  const [likedSongs, setLikedSongs] = useState([]);

  const fetchLikedSongs = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);

      const response = await fetch("http://127.0.0.1:8000/api/liked-songs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách bài hát yêu thích");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSongDetail = async (songId) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN); 

      const response = await fetch(`http://127.0.0.1:8000/api/songs/${songId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy thông tin bài hát");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadLikedSongs = async () => {
      const likedList = await fetchLikedSongs();

      if (!likedList) return; 

      const fullSongs = await Promise.all(
        likedList.map(async (item) => {
          const songDetail = await fetchSongDetail(item.song);
          return {
            id: item.id,
            likedAt: item.liked_at,
            ...songDetail,
          };
        })
      );

      setLikedSongs(fullSongs);
    };

    loadLikedSongs();
  }, []);


  const formatMinutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes}`;
  };

  return (
    <div className="flex flex-col bg-neutral-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-end gap-6 bg-gradient-to-b from-[#533c9f] via-[#402e7c] to-[#2a1e51] p-8 h-[40vh]">
        <img
          className="rounded shadow-lg w-48 h-48 object-cover mt-8"
          src="https://misc.scdn.co/liked-songs/liked-songs-64.png"
          alt="Liked Songs"
        />
        <div className="mt-12">
          <p className="text-sm font-semibold">Playlist</p>
          <h1 className="text-6xl font-bold mb-2">Bài hát đã thích</h1>
          <p className="text-sm text-gray-300">
            Tổng bài hát đã thích • {likedSongs.length} bài hát
          </p>
        </div>
      </div>

      {/* Play */}
      <div className="bg-gradient-to-b from-[#21183f] via-[#1d1635] to-[#1c1631] p-6 flex items-center gap-6">
      {likedSongs.length > 0 && (
          <button
            className="bg-green-500 hover:bg-green-400 p-4 rounded-full"
            onClick={() => handlePlaySongClick(likedSongs[0].id)}
          >
            <FaPlay size={24} className="text-black" />
          </button>
        )}
      </div>

      {/* List Songs */}
      <div className="bg-gradient-to-b from-[#1c1631] via-[#191527] to-[#121212] flex-1 px-8">
        <table className="w-full text-left table-auto">
          <thead className="border-b border-gray-700">
            <tr className="text-gray-400 uppercase text-sm tracking-wider">
              <th className="py-2">#</th>
              <th>Tiêu đề</th>
              <th>Album</th>
              <th>Ngày thêm</th>
              <th className="text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {likedSongs.map((song, index) => (
              <tr key={song.id} className="hover:bg-neutral-800 cursor-pointer" onClick={() => handlePlaySongClick(song.id)}>
                <td className="py-3">{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 object-cover rounded"
                      src={song.image_url}
                      alt="song"
                    />
                    <div>
                      <div className="font-semibold">{song.title}</div>
                      <div className="text-xs text-gray-400">{song.artistName}</div>
                    </div>
                  </div>
                </td>
                <td>{song.album || song.title}</td>
                <td>{new Date(song.likedAt).toLocaleDateString()}</td>
                <td className="text-right">{formatMinutesToTime(song.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
};

export default LikedSong;
