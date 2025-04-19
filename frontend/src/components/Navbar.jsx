import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold relative">
        <div className="flex items-center gap-2">
          <img
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_left}
            alt=""
            onClick={() => navigate(-1)}
          />
          <img
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_right}
            alt=""
            onClick={() => navigate(1)}
          />
        </div>

        <div className="flex items-center gap-4 relative">
          <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer">
            Explore Premium
          </p>
          <p className="bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer">
            Install App
          </p>

          {/* Avatar / Account Button */}
          <div className="relative">
            <p
              className="bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
              onClick={toggleMenu}
            >
              B
            </p>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-10 bg-[#1e1e1e] text-white rounded-lg shadow-lg w-60 py-2 z-10">
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  <Link to="/login"> Đăng nhập </Link>
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  <Link to="/register"> Đăng kí </Link>
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                <Link to="/profile"> Tài khoản </Link>
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Hồ Sơ
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Nâng cấp Premium
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Hỗ Trợ
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Tải Xuống
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center">
                  Cài Đặt
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
                <div className="px-4 py-2 hover:bg-[#333] cursor-pointer flex items-center text-red-400">
                  <Link to="/logout"> Đăng xuất </Link>
                  <img className="w-4 ml-auto" src={assets.home_icon} alt="" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex items-center gap-2 mt-4">
        <p className="bg-white text-black px-4 py-1 rounded-2xl">All</p>
        <p className="bg-[#242424] cursor-pointer px-4 py-1 rounded-2xl">
          Music
        </p>
        <p className="bg-[#242424] cursor-pointer px-4 py-1 rounded-2xl">
          Podcasts
        </p>
      </div>
    </>
  );
};

export default Navbar;
