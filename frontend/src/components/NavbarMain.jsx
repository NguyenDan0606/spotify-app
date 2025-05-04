import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useUser } from "../context/UserContext";


const NavbarMain = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const toggleMenu = () => setShowMenu(!showMenu);
  const [user] = useUser();
  const avatar = user?.avatar || localStorage.getItem("avatar") || assets.user_icon;


  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)){
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    }
  },[]);

  return (
    <div className="h-[8%] w-full bg-black text-white font-medium pt-2">
      <div className="flex justify-between items-center h-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-[1440px] mx-auto">
        {/* Bên trái */}
        <div className="flex items-center gap-4 pl-2 sm:pl-4 md:pl-6">
          <div className="relative group w-fit">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center"
            >
              <img className="w-8 h-8 sm:w-9 sm:h-9" src={assets.spotify_icon} alt="Spotify" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Spotify
            </div>
          </div>

          <div className="relative group w-fit">
            <button
              onClick={() => navigate("/")}
              className="bg-[#2a2a2a] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition"
            >
              <img className="w-5 h-5" src={assets.home_icon} alt="Home" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Trang chủ
            </div>
          </div>

          <div className="hidden md:flex items-center bg-[#2a2a2a] rounded-full px-3 py-2 w-[200px] sm:w-[300px] lg:w-[400px] h-10">
            <div className="relative group w-fit">
              <img
                src={assets.search_icon}
                alt="search"
                className="w-5 h-5 mr-2"
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
                Tìm kiếm
              </div>
            </div>
            <input
              type="text"
              placeholder="Bạn muốn phát nội dung gì?"
              className="bg-transparent outline-none text-white text-base w-full placeholder:text-sm"
            />
          </div>
        </div>

        {/* Bên phải */}
        <div className="relative flex items-center gap-3 sm:gap-4 md:gap-6 pr-2 sm:pr-4 md:pr-6">
          <div className="relative group w-fit hidden md:block">
            <button className="bg-white text-black text-sm px-4 py-1 rounded-full hover:scale-105 transition">
              Khám phá Premium
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none z-50">
              Nâng cấp lên Premium
            </div>
          </div>

          <button className="text-white text-sm hover:underline hidden md:flex items-center gap-2 hover:scale-105">
            <img
              className="invert w-4 h-4"
              src={assets.downloading_icon}
              alt="downloading"
            />
            Cài đặt Ứng dụng
          </button>

          <div className="relative group w-fit">
            <button className="bg-[#2a2a2a] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition">
              <img className="w-5 h-5" src={assets.bell_icon} alt="bell" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none z-50">
              Bản phát hành mới
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <div className="bg-[#2a2a2a] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#3a3a3a] transition">
              <div className="bg-black rounded-full p-[2px]">
                <button
                  onClick={toggleMenu}
                  className="text-white w-10 h-10 rounded-full flex items-center justify-center text-sm cursor-pointer focus:outline-none"
                >
                  <img
                    src={avatar || assets.user_icon}
                    alt="user icon"
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
              </div>
            </div>
            {showMenu && (
              <div className="absolute right-0 top-12 bg-[#1e1e1e] text-white rounded-lg shadow-lg w-56 py-2 z-20">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-[#333] cursor-pointer"
                  onClick={() => setShowMenu(false)}
                >
                  Hồ Sơ
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/useradmin"
                    className="block px-4 py-2 hover:bg-[#333] cursor-pointer"
                    onClick={() => setShowMenu(false)}
                  >
                    Admin
                  </Link>
                )}
                
                <Link
                  to="/logout"
                  className="block px-4 py-2 hover:bg-[#333] text-red-400 cursor-pointer"
                  onClick={() => setShowMenu(false)}
                >
                  Đăng xuất
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarMain;
