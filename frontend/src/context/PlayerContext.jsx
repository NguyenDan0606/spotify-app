import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },  
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  }

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  }

  const playWithId = (id) => {
    setTrack(songsData[id]);
    setTimeout(() => {
      audioRef.current.play();
      setPlayStatus(true);
    }, 100);
  }

  const previous = async ()=> {
    if (track.id>0) {
        await setTrack(songsData[track.id-1]);
        await audioRef.current.play();
        setPlayStatus(true);
    }
  }

  const next = async ()=> {
    if (track.id< songsData.length-1) {
        await setTrack(songsData[track.id+1]);
        await audioRef.current.play();
        setPlayStatus(true);
    }
  }

  const seekSong = (e) => {
    const offsetX = e.nativeEvent.offsetX;
    const seekWidth = seekBg.current.offsetWidth;
    const percentage = offsetX / seekWidth;
  
    const newTime = percentage * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };
  
  

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  }

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  }

  useEffect(() => {
    const audio = audioRef.current;
    const handleLoadedMetadata = () => {
      setTime(prev => ({
        ...prev,
        totalTime: {
          second: Math.floor(audio.duration % 60),
          minute: Math.floor(audio.duration / 60),
        }
      }));
    };
  
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
  
    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      const duration = audio.duration;
  
      // Cập nhật thời gian hiện tại
      setTime(prev => ({
        ...prev,
        currentTime: {
          second: Math.floor(current % 60),
          minute: Math.floor(current / 60),
        },
      }));
  
      // Cập nhật thanh seekBar
      if (seekBar.current && seekBg.current) {
        const progress = (current / duration) * 100;
        seekBar.current.style.width = `${progress}%`;
      }
    };
  
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);
  

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,setTrack,
    playStatus,setPlayStatus,
    time,setTime,
    play,pause,
    playWithId,
    previous,
    next,
    seekSong,
    isMuted, toggleMute,
    volume, handleVolumeChange,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
