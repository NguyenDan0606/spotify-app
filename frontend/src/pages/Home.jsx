import { useContext } from "react";
import Display from "../components/Display";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";
import NavbarMain from "../components/NavbarMain";
import Video from "../components/Video";
import { PlayerContext } from "../context/PlayerContext";
import { useState } from "react";
import EditPlaylistModal from "../components/EditPlaylistModal ";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Home() {

 
  // const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible,setRightPanelVisible] = useState(false);
  const handleMusicClick = () => {
    setRightPanelVisible(true);
  }

  const [isOpenPlayList,setIsOpenPlayList] =useState(false);
  const handlePlayListClick = () => {
    setIsOpenPlayList(true);
  }


  const { track, isVideo } = useContext(PlayerContext);
  return (
    <div className="h-screen bg-black overflow-x-hidden">
      <NavbarMain />
      <div className="h-[82%] flex">
      <ToastContainer position="bottom-center" autoClose={2000} />
        {/* {leftPanelVisible && <Sidebar setLeftPanelVisible={setLeftPanelVisible}/>} */}
        <Sidebar handlePlayListClick={handlePlayListClick}/>
        <Display handleMusicClick={handleMusicClick} rightPanelVisible={rightPanelVisible} setRightPanelVisible={setRightPanelVisible}/>
        {rightPanelVisible && <Video key={track?.id}  isVideo={isVideo} track={track}/>}
      </div>
      { isOpenPlayList && <EditPlaylistModal setIsOpenPlayList={setIsOpenPlayList}/>} 
      <Player 
        handleMusicClick={handleMusicClick} setRightPanelVisible={setRightPanelVisible}  setIsOpenPlayList={setIsOpenPlayList}

      />
      

      
    </div>
  );
}

export default Home;
