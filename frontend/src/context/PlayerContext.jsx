/* eslint-disable react/prop-types */
import { createContext, useEffect, useRef, useState } from "react";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [track, setTrack] = useState();
  const [seekValue, setSeekValue] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
    remainingTime: { second: 0, minute: 0 },
  });

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/songs/")
      .then(response => response.json())
      .then(data => setSongs(data))
      .catch(error => console.error("Lỗi khi load songs:", error));
  }, []);

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const playWithId = (id) => {
    const selected = songs.find(song => song.id === id);
    if (selected) {
      setPlayStatus(false);
      setTrack(selected);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = selected.audio_file; // Cập nhật lại nguồn âm thanh
          audioRef.current.load(); // Tải lại âm thanh mới
          audioRef.current.play().catch((err) => console.error("Không thể play audio:", err)); // Phát nhạc ngay
          setPlayStatus(true);
        }
      }, 0); // Đợi một chút để cập nhật track và load file âm thanh mới
    }
  };

  const next = () => {
    const currentIndex = songs.findIndex(s => s.id === track?.id);
    if (currentIndex < songs.length - 1) {
      setTrack(songs[currentIndex + 1]);
    }
  };

  const previous = () => {
    const currentIndex = songs.findIndex(s => s.id === track?.id);
    if (currentIndex > 0) {
      setTrack(songs[currentIndex - 1]);
    }
  };

  const seekSong = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setSeekValue(newTime);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  useEffect(() => {
    if (track) {
      const audio = audioRef.current;

      const handleCanPlay = async () => {
        try {
          await audio.play();
          setPlayStatus(true);
        } catch (err) {
          console.error("Không thể play audio:", err);
        }
      };

      audio.addEventListener("canplay", handleCanPlay);

      // Play ngay lập tức nếu ready
      if (audio.readyState >= 3) { // HAVE_FUTURE_DATA
        handleCanPlay();
      }

      return () => {
        audio.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [track]);

  // Cập nhật thời gian tổng của bài hát
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setTime(prev => ({
        ...prev,
        totalTime: {
          second: Math.floor(audio.duration % 60),
          minute: Math.floor(audio.duration / 60),
        },
      }));
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Cập nhật thời gian hiện tại khi bài hát đang chạy
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      const duration = audio.duration || 0;
      const remainingSeconds = Math.max(duration - current, 0);

      setTime(prev => ({
        ...prev,
        currentTime: {
          second: Math.floor(current % 60),
          minute: Math.floor(current / 60),
        },
        remainingTime: {
          second: Math.floor(remainingSeconds % 60),
          minute: Math.floor(remainingSeconds / 60),
        },
      }));

      setSeekValue(current);

      if (seekBar.current && seekBg.current) {
        const progress = (current / duration) * 100;
        seekBar.current.style.width = `${progress}%`;
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track, setTrack,
    playStatus, setPlayStatus,
    time, setTime,
    play, playWithId,
    previous,
    next,
    seekSong,
    isMuted, toggleMute,
    volume, handleVolumeChange,
    seekValue, setSeekValue,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
      <audio
        ref={audioRef}
        src={track?.audio_file || ""} // Tệp nhạc sẽ tự động thay đổi khi chọn bài mới
        onEnded={next} // Tự động chuyển bài khi kết thúc
      />
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
