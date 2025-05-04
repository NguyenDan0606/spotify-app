import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets";

const AdminNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const toggleMenu = () => setShowMenu(!showMenu);
  const avatar = localStorage.getItem("avatar");

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
              onClick={() => navigate("/useradmin")}
              className="flex items-center justify-center"
            >
              <img className="w-8 h-8 sm:w-9 sm:h-9" src={assets.spotify_icon} alt="Spotify" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
              Spotify
            </div>
          </div>
        </div>

        {/* Ở giữa */}
        <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-500">Trang Admin</h1>
        </div>

        {/* Bên phải */}
        <div className="relative flex items-center gap-4 sm:gap-4 md:gap-6 pr-2 sm:pr-4 md:pr-6">
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

                <Link
                  to="/useradmin"
                  className="block px-4 py-2 hover:bg-[#333] cursor-pointer"
                  onClick={() => setShowMenu(false)}
                >
                  Admin
                </Link>
                
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

export default AdminNavbar;
