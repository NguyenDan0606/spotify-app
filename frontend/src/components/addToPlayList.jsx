/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ACCESS_TOKEN } from "../constans";
import PlayList from "./PlayList";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const AddToPlaylist = ({ songId, onClose, setIsOpenPlayList }) => {
  const [playlists, setPlaylists] = useState([]);
  const [playlistsWithSong, setPlaylistsWithSong] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    // Lấy danh sách playlist của người dùng
    axios
      .get("http://localhost:8000/api/playlists/my-playlists/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fetchedPlaylists = res.data;
        setPlaylists(fetchedPlaylists);
        
        // Sau khi có danh sách playlist, kiểm tra từng playlist xem có chứa bài hát không
        const playlistPromises = fetchedPlaylists.map(playlist => {
          return axios.get(`http://localhost:8000/api/playlist-songs/by-playlist/${playlist.id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(response => {
            // Kiểm tra xem playlist này có chứa bài hát không
            const containsSong = response.data.some(song => song.id === songId);
            return containsSong ? playlist.id : null;
          })
          .catch(err => {
            console.error(`Error fetching songs for playlist ${playlist.id}:`, err);
            return null;
          });
        });
        
        Promise.all(playlistPromises)
          .then(playlistIdsWithSong => {
            // Lọc bỏ các giá trị null
            const validPlaylistIds = playlistIdsWithSong.filter(id => id !== null);
            setPlaylistsWithSong(validPlaylistIds);
          })
          .catch(err => console.error("Error in Promise.all:", err));
      })
      .catch((err) => console.error("Error fetching playlists:", err));
  }, [songId, token]);

  const handleAddSongToPlaylist = (playlistId) => {
    // Kiểm tra xem bài hát đã tồn tại trong playlist chưa
    if (playlistsWithSong.includes(playlistId)) {
      toast.error("Bài hát đã tồn tại trong playlist này!");
      return;
    }

    axios
      .post(
        "http://localhost:8000/api/playlist-songs/",
        { playlist: playlistId, song: songId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        
        toast.success(`Đã thêm vào playlist: ${playlists.find((p) => p.id === playlistId)?.name}!`);
        // Cập nhật danh sách playlist đã chứa bài hát
        setPlaylistsWithSong([...playlistsWithSong, playlistId]);
        onClose?.(); // đóng dropdown
      })
      .catch((err) => console.error("Error adding song to playlist:", err));
  };

  return (
    <div className="bg-neutral-800 text-white rounded shadow-lg w-64">
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-neutral-600 hover:bg-neutral-700 cursor-pointer hover:text-green-400"
        onClick={() => {
          setIsOpenPlayList(true);
          onClose?.(); // đóng dropdown nếu cần
        }}
      >
        <img className="w-3" src={assets.plus_icon} alt="plus_icon" />
        <p>Tạo playlist mới</p>
      </div>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          onClick={() => handleAddSongToPlaylist(playlist.id)}
          className="flex justify-between items-center px-4 py-2 hover:bg-neutral-700 cursor-pointer"
        >
          <span>{playlist.name}</span>
          {playlistsWithSong.includes(playlist.id) && (
            <FontAwesomeIcon 
              icon={faCheck} 
              className="text-green-500"
            />
          )}
        </div>
      ))}
      {showCreateModal && (
        <PlayList onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default AddToPlaylist;