/* eslint-disable react/prop-types */
import Footer from "./Footer";
import { FaPlay } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { PlayerContext } from "../context/PlayerContext";


const DetailArtist = ( {setRightPanelVisible} ) => {
  const { artistId } = useParams();
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState(null);
  

const handlePlaySongClick=(songID)=> {
    setRightPanelVisible(true);
    playWithId(songID);
  }
  const { playWithId } = useContext(PlayerContext);

  useEffect(() => {
    const fetchArtistSongs = async () => {
      const songRes = await axios.get(
        `http://localhost:8000/api/artists/${artistId}/songs/`
      );
      const artistRes = await axios.get(
        `http://localhost:8000/api/artists/${artistId}/`
      );
      setSongs(songRes.data);
      setArtist(artistRes.data);
    };
    fetchArtistSongs();
  }, [artistId]);

  
  

  const formatMinutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes}`;
  };

  return (
    <div className="flex flex-col bg-neutral-900 text-white min-h-screen">
      {/* Header */}
      <div
        className={`flex items-end gap-6 bg-gradient-to-b from-[#2e2a2a] via-[#232020] to-[#1a1818] p-8 h-[40vh]`}
      >
        <img
          className="rounded shadow-lg w-48 h-48 object-cover mt-8"
          src={artist?.image_url}
          alt="Artist"
        />
        

        <div className="mt-12">
          <p className="text-sm font-semibold">Nghệ sĩ</p>
          <h1 className="text-6xl font-bold mb-2">{artist?.name}</h1>
          <p className="text-sm text-gray-300">
            Tổng bài hát của {artist?.name} • {songs?.length} bài hát
          </p>
        </div>
      </div>

      {/* Play */}
      <div className="bg-gradient-to-b from-[#141313]  to-[#181717] p-6 flex items-center gap-6">
        <button className="bg-green-500 hover:bg-green-400 p-4 rounded-full" onClick={() => handlePlaySongClick(songs[0].id)}>
          
          <FaPlay size={24} className="text-black" />
        </button>
      </div>

      {/* List Songs */}
      <div className="bg-gradient-to-b from-[#181717]  to-[#121212] flex-1 px-8">
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
            {songs.map((item, index) => (
              <tr key={item.id} className="hover:bg-neutral-800 cursor-pointer" onClick={() => handlePlaySongClick(item.id)}>
                <td className="py-3">{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 object-cover rounded"
                      src={item.image_url}
                      alt="song"
                    />
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-gray-400"></div>
                    </div>
                  </div>
                </td>
                <td>{item.album || item.title}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="text-right">
                  {formatMinutesToTime(item.duration)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-neutral-900 text-white px-8 py-6 border-t border-gray-700">
        <h2 className="text-2xl font-bold mb-2">Thông tin nghệ sĩ</h2>
        <p className="text-gray-300">{artist?.bio || "Không có mô tả."}</p>
      </div>

      <Footer />
    </div>
  );
};

export default DetailArtist;
