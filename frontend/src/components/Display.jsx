import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
// import DisplayAlbum from "./DisplayAlbum";
// import Profile from "./Profile";
import { useEffect, useRef } from "react";
import { albumsData } from "../assets/assets";

// eslint-disable-next-line react/prop-types
const Display = ({handleMusicClick, rightPanelVisible}) => {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.split("/").pop() : "";
  const bgColor = isAlbum ? albumsData[Number(albumId)]?.bgColor : null;

  useEffect(() => {
    if (isAlbum && bgColor) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
    } else {
      displayRef.current.style.background = "#121212";
    }
  }, [location]);

  return (
    <div
      ref={displayRef}
      className={`
        w-full m-2 rounded bg-[#121212] text-white overflow-auto
        ${rightPanelVisible ? 'lg:w-[50%]' : 'lg:w-[74%]'}
        lg:ml-0 lg:mr-0
      `}

    >
      <Routes>
        <Route path="/" element={<DisplayHome handleMusicClick={handleMusicClick}/>} />
        {/* <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </div>
  );
};

export default Display;