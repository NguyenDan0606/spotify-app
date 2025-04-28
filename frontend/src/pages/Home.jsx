import { useContext } from "react";
import Display from "../components/Display";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";
import NavbarMain from "../components/NavbarMain";
import Video from "../components/Video";
import { PlayerContext } from "../context/PlayerContext";
import { useState } from "react";

function Home() {

 
  // const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible,setRightPanelVisible] = useState(false);
  const handleMusicClick = () => {
    setRightPanelVisible(true);
  }

  const { track, isVideo } = useContext(PlayerContext);
  return (
    <div className="h-screen bg-black overflow-x-hidden">
      <NavbarMain />
      <div className="h-[82%] flex">
        {/* {leftPanelVisible && <Sidebar setLeftPanelVisible={setLeftPanelVisible}/>} */}
        <Sidebar/>
        <Display handleMusicClick={handleMusicClick} rightPanelVisible={rightPanelVisible}/>
        {rightPanelVisible && <Video key={track?.id}  isVideo={isVideo} track={track}/>}
      </div>
      <Player 
        handleMusicClick={handleMusicClick} setRightPanelVisible={setRightPanelVisible} 
      />
      

      
    </div>
  );
}

export default Home;
