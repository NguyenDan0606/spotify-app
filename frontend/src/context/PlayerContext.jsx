/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useRef, useState, useEffect } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isVideoSeekable, setIsVideoSeekable] = useState(false);
  const [track, setTrack] = useState(null);
  const [time, setTime] = useState({

    currentTime: { minute: 0, second: 0 },
    remainingTime: { minute: 0, second: 0 }

  });
  const [isMediaReady, setIsMediaReady] = useState(false);


  // Xác định isVideo dựa trên track hiện tại
  const isVideo = track?.audio_file?.endsWith(".mp4");
  
  // Lấy ref hiện tại dựa trên loại media
  const getCurrentRef = () => isVideo ? videoRef.current : audioRef.current;


  // Fetch danh sách bài hát khi component mount
  useEffect(() => {

    const fetchSongs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/songs/');
        const data = await response.json();
        setSongs(data);
        if (data.length > 0) {
          setTrack(data[0]);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  // Xử lý khi track thay đổi
  useEffect(() => {
    if (!track) return;
    
    console.log("Setting new track:", track.title);
    setIsMediaReady(false);
    
    // Dừng cả audio và video trước khi thay đổi track
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }
    
    // Set source cho media phù hợp
    const ref = getCurrentRef();
    if (ref) {
      ref.src = track.audio_file;
      ref.volume = volume;
      ref.muted = isMuted;
      
      // Add loadedmetadata event to detect when media is ready
      const handleMetadataLoaded = () => {
        console.log("Media metadata loaded");
        setIsMediaReady(true);
        
        // Nếu đang trong trạng thái play, thì phát media mới
        if (playStatus) {
          ref.play()
            .then(() => setPlayStatus(true))
            .catch(err => {
              console.error(`${isVideo ? "Video" : "Audio"} play error:`, err);
              setPlayStatus(false);
            });
        }
      };
      
      ref.addEventListener('loadedmetadata', handleMetadataLoaded);
      
      return () => {
        ref.removeEventListener('loadedmetadata', handleMetadataLoaded);
      };
    }
  }, [track, isVideo]);

  // Xử lý khi playStatus thay đổi
  useEffect(() => {
    if (!track || !isMediaReady) return;
    
    const ref = getCurrentRef();
    if (!ref) return;
    
    if (playStatus) {
      console.log("Playing media");
      ref.play()
        .then(() => {})
        .catch(err => {
          console.error("Playback error:", err);
          setPlayStatus(false);
        });
    } else {
      console.log("Pausing media");
      ref.pause();
    }
  }, [playStatus, isMediaReady]);

  // Cập nhật thời gian phát mỗi giây
  useEffect(() => {
    const updateTime = () => {
      const ref = getCurrentRef();
      if (ref && !isNaN(ref.duration)) {
        const currentTime = ref.currentTime;
        const duration = ref.duration || 0;
        const remainingTime = duration - currentTime;

        setTime({
          currentTime: {
            minute: Math.floor(currentTime / 60),
            second: Math.floor(currentTime % 60)
          },
          remainingTime: {
            minute: Math.floor(remainingTime / 60),
            second: Math.floor(remainingTime % 60)
          }
        });
      }
    };

    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [isVideo]);

  // Xử lý khi một track kết thúc
  useEffect(() => {

    const handleTrackEnd = () => {
      console.log("Track ended, playing next");
      const newIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(newIndex);
      setTrack(songs[newIndex]);
      
      // Đảm bảo trạng thái play được giữ khi chuyển sang bài tiếp theo
      setPlayStatus(true);
    };

    const audioElement = audioRef.current;
    const videoElement = videoRef.current;
    
    if (audioElement) {
      audioElement.addEventListener('ended', handleTrackEnd);
    }
    
    if (videoElement) {
      videoElement.addEventListener('ended', handleTrackEnd);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleTrackEnd);
      }
      if (videoElement) {
        videoElement.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, [currentSongIndex, songs]);


  // Đồng bộ trạng thái play/pause từ media player
  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
  
    const handlePlay = () => setPlayStatus(true);
    const handlePause = () => setPlayStatus(false);
  
    if (audio) {
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
    }
    if (video) {
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
    }
  
    return () => {
      if (audio) {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
      }
      if (video) {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
      }
    };
  }, []);

  const play = () => {
    if (!isMediaReady) return;
    
    const ref = getCurrentRef();
    if (ref) {
      console.log("Play function called");
      ref.play()
        .then(() => setPlayStatus(true))
        .catch(err => {
          console.error("Playback error:", err);
          setPlayStatus(false);
        });
    }
  };

  const pause = () => {
    const ref = getCurrentRef();
    if (ref) {
      console.log("Pause function called");
      ref.pause();
      setPlayStatus(false);
    }
  };

  const toggleMute = () => {
    const ref = getCurrentRef();
    if (ref) {
      const newMutedState = !isMuted;
      ref.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    const ref = getCurrentRef();
    if (ref) {
      ref.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        ref.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        ref.muted = false;
      }
    }
  };

  const previous = () => {
    if (songs.length === 0) return;
    let newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(newIndex);
    setTrack(songs[newIndex]);
    
    // Đảm bảo trạng thái play được giữ nguyên
    // setPlayStatus sẽ được gọi sau khi media đã load xong
  };

  const next = () => {
    if (songs.length === 0) return;
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    setTrack(songs[newIndex]);
    
    // Đảm bảo trạng thái play được giữ nguyên
    // setPlayStatus sẽ được gọi sau khi media đã load xong
  };


  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    
    const handleVideoLoadedData = () => {
      console.log("Video data loaded, now seekable");
      setIsVideoSeekable(true);
    };
    
    const videoElement = videoRef.current;
    videoElement.addEventListener('loadeddata', handleVideoLoadedData);
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleVideoLoadedData);
    };
  }, [isVideo, track]);

  const seekSong = (e) => {
    const seekTime = parseFloat(e.target.value);
    const ref = getCurrentRef();
  
    if (!ref || isNaN(ref.duration)) return;
    if (isVideo && !isVideoSeekable) {
      console.warn("Video không seekable, đang chờ video load");
      return;
    }
  
    try {
      console.log(`Seeking to ${seekTime} / ${ref.duration}`);
      ref.currentTime = seekTime;
      
      setTime({
        currentTime: {
          minute: Math.floor(seekTime / 60),
          second: Math.floor(seekTime % 60),
        },
        remainingTime: {
          minute: Math.floor((ref.duration - seekTime) / 60),
          second: Math.floor((ref.duration - seekTime) % 60),
        },
      });
  
    } catch (err) {
      console.error("Error seeking media:", err);
    }
  };
  
  
  
  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const playWithId = (id) => {
    const songIndex = songs.findIndex(song => song.id === id);
    if (songIndex !== -1) {
      stopAll();
      setCurrentSongIndex(songIndex);
      setTrack(songs[songIndex]);
      setPlayStatus(true); // Đặt playStatus thành true để tự động phát sau khi media đã load
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        videoRef,
        playStatus,
        isMuted,
        volume,
        track,
        time,
        play,
        pause,
        toggleMute,
        handleVolumeChange,
        previous,
        next,
        seekSong,
        playWithId,
        songs,
        isVideo,
        isMediaReady,

      }}
    >
      <audio ref={audioRef} style={{ display: "none" }} preload="auto" />
      <video ref={videoRef} style={{ display: "none" }} preload="auto" controls />
      {children}
    </PlayerContext.Provider>
  );
};

