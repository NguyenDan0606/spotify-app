import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Albums", path: "/useradmin/albums" },
  { label: "Artist Follows", path: "/useradmin/artist-follows" },
  { label: "Artist", path: "/useradmin/artist" },
  { label: "Comments", path: "/useradmin/comments" },
  { label: "Liked Songs", path: "/useradmin/liked-songs" },
  { label: "Listening Histories", path: "/useradmin/listening-histories" },
  { label: "Playlist Songs", path: "/useradmin/playlist-songs" },
  { label: "Songs", path: "/useradmin/api/songs" },
  { label: "Users", path: "/useradmin/api/users" },
];

const AdminSidebar = ({ selectedPath }) => {
  const navigate = useNavigate();

  return (
    <div className="w-[20%] h-full p-2 flex-col rounded-lg gap-2 text-white flex text-sm">
      <div className="bg-[#121212] h-[100%] rounded-lg">
        <h2 className="text-[25px] font-semibold mb-4 text-center text-green-500 mt-4 mb-4">
          Trang Quản Trị Web
        </h2>
        <div className="space-y-3 text-[18px] font-semibold">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer px-4 py-2 rounded text-center 
                ${
                  selectedPath === item.path
                    ? "bg-green-600"
                    : "bg-[#2c2c2c] hover:bg-[#3a3a3a]"
                }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

AdminSidebar.propTypes = {
  selectedPath: PropTypes.string.isRequired,
};

export default AdminSidebar;