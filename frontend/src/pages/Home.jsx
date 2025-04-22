import { useContext } from "react";
import Display from "../components/Display";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";
import NavbarMain from "../components/NavbarMain";
import Video from "../components/Video";
import { PlayerContext } from "../context/PlayerContext";
import { useState } from "react";

function Home() {

  // const [activeMusicItemId,setActiveMusicItemId] = useState();
  

  const [showVideo,setShowVideo] = useState(false);
  const handleMusicClick = () => {
    setShowVideo(!showVideo);
  }

  const { audioRef, track } = useContext(PlayerContext);
  return (
    <div className="h-screen bg-black overflow-x-hidden">
      <NavbarMain />
      <div className="h-[82%] flex">
        <Sidebar />
        <Display />
        {showVideo && <Video />}
      </div>
      <Player 
        handleMusicClick={handleMusicClick}
      />
      <audio ref={audioRef} src={track?.file} preload="auto"></audio>
    </div>
  );
}

export default Home;
