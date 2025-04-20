import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Player = () => {
  const {
    isMuted,
    toggleMute,
    volume,
    handleVolumeChange,
    // seekBar,
    // seekBg,
    playStatus,
    play,
    pause,
    track,
    time,
    previous,
    next,
    seekSong,
    audioRef,
  } = useContext(PlayerContext);

  const [liked, setLiked] = useState(false);
  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="relative h-[10%] w-full bg-black flex justify-between items-center text-white px-4">
      {/* Left section: Track info + Like button */}
      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12" src={track.image} alt="song_Data" />
        <div className="flex items-center gap-4">
          <div>
            <p>{track.name}</p>
            <p>{track.desc.slice(0, 43)}</p>
          </div>
          
          {/* Button Trái Tym */}
          <div className="relative group">
            <button
              onClick={toggleLike}
              className={`bg-[#2a2a2a] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition duration-300`}
            >
              <img
                className={`w-4 h-4 transition-transform duration-300 ${liked ? "scale-105 animate-ping-once invert" : "invert scale-100"}`}
                src={liked ? assets.heartlove_icon : assets.heart_icon}
                alt="like"
              />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
                Thêm vào Bài hát yêu thích
            </div>
          </div>
        </div>
      </div>

      {/* Center section: Controls + Seekbar */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          {/* Bật Trộn Bài */}
          <div className="relative group">
            <button className="p-1">
              <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="Shuffle" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Bật Trộn Bài
            </div>
          </div>          
          {/* Trước */}
          <div className="relative group">
            <button onClick={previous} className="p-1">
              <img className="w-4 cursor-pointer" src={assets.prev_icon} alt="Previous" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Trước
            </div>
          </div>
          {/* Button Phát/Tạm Dừng */}
          <div className="relative group">
            {playStatus ? (
              <button onClick={pause} className="p-1">
                <img className="w-4 cursor-pointer" src={assets.pause_icon} alt="Pause" />
              </button>
            ) : (
              <button onClick={play} className="p-1">
                <img className="w-4 cursor-pointer" src={assets.play_icon} alt="Play" />
              </button>
            )}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              {playStatus ? "Tạm dừng" : "Phát"}
            </div>
          </div>
          {/* Sau */}
          <div className="relative group">
            <button onClick={next} className="p-1">
              <img className="w-4 cursor-pointer" src={assets.next_icon} alt="Next" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Sau
            </div>
          </div>      
          {/* Kích hoạt chế độ lặp lại */}
          <div className="relative group">
              <button className="p-1">
                <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="Loop" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
                 Kích hoạt chế độ lặp lại
              </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <p>{time.currentTime.minute}:{String(time.currentTime.second).padStart(2, "0")}</p>              
          <input
            type="range"
            min="0"
            max={audioRef.current?.duration || 1}
            value={audioRef.current?.currentTime || 0}
            onChange={seekSong}
            className="w-[60vw] max-w-[500px] h-1 accent-green-500 cursor-pointer"
          />
          <p>{time.remainingTime.minute}:{String(time.remainingTime.second).padStart(2, "0")}</p>
        </div>
      </div>

      {/* Right section: Options */}
      <div className="hidden lg:flex items-center gap-2 opacity-75">
        {/* Button Plays */}
        <div className="relative group">
            <button className="p-1">
              <img className="w-4" src={assets.plays_icon} alt="Plays" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Chế độ xem Đang phát
            </div>
        </div>
        {/* Button Mic */}
        <div className="relative group">
            <button className="p-1">
              <img className="w-4" src={assets.mic_icon} alt="" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Lời bài hát
            </div>
        </div>
        {/* Button Queue */}
        <div className="relative group">
            <button className="p-1">
              <img className="w-4" src={assets.queue_icon} alt="" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Danh sách chờ
            </div>
        </div>      
        {/* Button Speaker */}
        <div className="relative group">
            <button className="p-1">
              <img className="w-4" src={assets.speaker_icon} alt="" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Kết nối với một thiết bị
            </div>
        </div>
        {/* Button Volume + Mute */}
        <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="p-1">
              <img className="w-4 invert" src={isMuted ? assets.mute_icon : assets.volume_icon} alt="" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 rounded accent-green-500"
            />
        </div>
         {/* Button Mini_player */}
         <div className="relative group">
            <button className="p-1">
              <img className="w-4" src={assets.mini_player_icon} alt="" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Mở Trình phát thu nhỏ
            </div>
        </div>
         {/* Button Zoom */}
         <div className="relative group">
            <button className="p-1">
              <img className="w-4" src={assets.zoom_icon} alt="" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Mở chế độ Toàn màn hình
            </div>
        </div>
      </div>
    </div>
  );
};

export default Player;