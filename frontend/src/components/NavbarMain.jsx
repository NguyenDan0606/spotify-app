import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const NavbarMain = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="h-14 w-full flex justify-between items-center px-6 bg-black text-white font-medium pt-2">
      {/* Bên trái */}
      <div className="flex items-center gap-4 pl-[50px]">
        <button onClick={() => navigate("/")} 
          className="flex items-center justify-center">
          <img className="w-9 h-9" src={assets.spotify_icon} alt="Spotify" />
        </button>

        <button onClick={() => navigate("/")}
          className="bg-[#2a2a2a] w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition">
          <img className="w-6 h-6" src={assets.home_icon} alt="Home" />
        </button>

        <div className="hidden md:flex items-center bg-[#2a2a2a] rounded-full px-4 py-2 w-[400px] h-11">
          <img src={assets.search_icon} alt="search" className="w-6 h-6 mr-2" />
          <input
            type="text"
            placeholder="Bạn muốn phát nội dung gì?"
            className="bg-transparent outline-none text-white text-base w-full placeholder:text-base"
          />
        </div>
      </div>

      {/* Bên phải */}
      <div className="relative flex items-center gap-6 font-bold pr-[150px]">
        <button className="bg-white text-black text-base px-4 py-1 rounded-full hover:scale-105 transition hidden md:block">
          Khám phá Premium
        </button>

        <button className="text-white text-base hover:underline hidden md:flex items-center gap-2 hover:scale-105">
          <img className="invert" src={assets.downloading_icon} alt="downloading" />
          Cài đặt Ứng dụng
        </button>

        <button className="bg-[#2a2a2a] w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition">
          <img className="w-6 h-6" src={assets.bell_icon} alt="bell" />
        </button>

        <div className="bg-[#2a2a2a] w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition">
          <div className="bg-black rounded-full p-[3px]">
            <button
              onClick={toggleMenu}
              className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-base cursor-pointer focus:outline-none"
            >
              Z
            </button>
          </div>
          {showMenu && (
              <div className="absolute right-0 top-10 bg-[#1e1e1e] text-white rounded-lg shadow-lg w-60 py-2 z-10">
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Tài Khoản
                  <img className="invert w-4 ml-auto" src={assets.external_icon} alt="external" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Hồ Sơ
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Nâng cấp Premium
                  <img className="invert w-4 ml-auto" src={assets.external_icon} alt="external" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Hỗ Trợ
                  <img className="invert w-4 ml-auto" src={assets.external_icon} alt="external" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Tải Xuống
                  <img className="invert w-4 ml-auto" src={assets.external_icon} alt="external" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Cài Đặt
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Đăng Xuất
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NavbarMain;
