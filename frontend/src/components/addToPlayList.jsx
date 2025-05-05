/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constans";
import PlayList from "./PlayList";

const AddToPlaylist = ({ songId, onClose, setIsOpenPlayList }) => {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/playlists/my-playlists/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPlaylists(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddSongToPlaylist = (playlistId) => {
    axios
      .post(
        "http://localhost:8000/api/playlist-songs/",
        { playlist: playlistId, song: songId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Đã thêm vào playlist!");
        onClose?.(); // đóng dropdown
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="bg-neutral-800 text-white rounded shadow-lg w-64">
      <div className="p-2 border-b border-neutral-600">
        <button
          onClick={() => {
            setIsOpenPlayList(true);
            onClose?.(); // đóng dropdown nếu cần
          }}
          className="text-green-400 hover:underline"
        >
          + Tạo playlist mới
        </button>
      </div>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          onClick={() => handleAddSongToPlaylist(playlist.id)}
          className="px-4 py-2 hover:bg-neutral-700 cursor-pointer"
        >
          {playlist.name}
        </div>
      ))}
      {showCreateModal && <PlayList onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};


export default AddToPlaylist;
