import { FaPlay } from "react-icons/fa";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../constans";
import axios from "axios";

const PlayList = () => {
  const { playlistId } = useParams();
  const [Songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const selectedPlaylist = playlists.find((playlist) => playlist.id ===
  Number(playlistId));

  const token = localStorage.getItem(ACCESS_TOKEN);
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/playlist-songs/by-playlist/${playlistId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSongs(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy bài hát:", err);
      }
    };

    fetchSongs();
  }, [playlistId]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/playlists/my-playlists/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPlaylists(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy playlist:", error);
      }
    };

    fetchPlaylists();
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
      
      {selectedPlaylist && (
        <div
          key={selectedPlaylist.id}
          className="flex items-end gap-6 bg-gradient-to-b from-[#533c9f] via-[#402e7c] to-[#2a1e51] p-8 h-[40vh]"
        >
          <img
            className="rounded shadow-lg w-48 h-48 object-cover mt-8"
            src={
              selectedPlaylist.image_url_display || selectedPlaylist.image_url
            }
            alt="Playlist"
          />
          <div className="mt-12">
            <p className="text-sm font-semibold">Playlist</p>
            <h1 className="text-6xl font-bold mb-2">{selectedPlaylist.name}</h1>
            <p className="text-sm text-gray-300">
              Tổng bài hát • {Songs.length || 0} bài hát
            </p>
          </div>
        </div>
      )}
      {/* Play */}
      <div className="bg-gradient-to-b from-[#21183f] via-[#1d1635] to-[#1c1631] p-6 flex items-center gap-6">
        <button className="bg-green-500 hover:bg-green-400 p-4 rounded-full">
          <FaPlay size={24} className="text-black" />
        </button>
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
            {Songs.map((song, index) => (
              <tr key={song.id} className="hover:bg-neutral-800 cursor-pointer">
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
                      <div className="text-xs text-gray-400">
                        {song.artistName}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{song.album || song.title}</td>
                <td>{new Date(song.likedAt).toLocaleDateString()}</td>
                <td className="text-right">
                  {formatMinutesToTime(song.duration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default PlayList;
