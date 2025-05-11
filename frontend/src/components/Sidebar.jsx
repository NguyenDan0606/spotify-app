/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { assets } from "../assets/assets";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { toast } from "react-toastify";


const Sidebar = ({handlePlayListClick, playlists,token,setPlaylists }) => {
  const navigate = useNavigate();

  // const [message, setMessage] = useState("");
  // const [showThankYou, setShowThankYou] = useState(false);

  // const handleSend = () => {
  //   if (message.trim() !== "") {
  //     setShowThankYou(true);
  //     setTimeout(() => {
  //       setShowThankYou(false);
  //     }, 3000); // 3 giây sau ẩn thông báo
  //     setMessage(""); // Xóa input sau khi gửi
  //   }
  // };

  // Xóa playlist
  const handleDelete = async (playlistId) => {
  const result = await Swal.fire({
    title: `Bạn có chắc chắn muốn xóa: ${playlists.find((p) => p.id === playlistId)?.name}?`,
    text: "Hành động này sẽ không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    background: "#1f2937", 
    color: "#f9fafb",
  });
  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8000/api/playlists/${playlistId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));

      toast.success(`Đã xóa playlist: ${playlists.find((p) => p.id === playlistId)?.name}`);
    } catch (error) {
      console.error("Lỗi khi xóa playlist:", error);
      toast.success("Lỗi!", "Không thể xóa playlist.", "error");
    }
  }
};


  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white flex text-sm">
      <div className="bg-[#121212] h-[100%] rounded">
        <div className="p-3 flex items-center justify-between">
          <div className="relative group w-fit">
            <button
              className="flex items-center gap-3 text-gray-400 hover:text-white"
              // onClick={() => props.setLeftPanelVisible(false)}
            >
              <img className="w-6" src={assets.stack_icon} alt="stack_icon" />
              <p className="font-bold text-[18px]">Thư viện</p>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-black rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap">
              Thu gọn thư viện
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <button
                onClick={handlePlayListClick}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-[#242424] rounded-full cursor-pointer hover:brightness-125 transition duration-200"
              >
                <img className="w-3" src={assets.plus_icon} alt="plus_icon" />
                <span className="text-sm font-semibold">Tạo</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#242424] text-white font-bold text-sm rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
                Tạo danh sách, thư mục hoặc Jam
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex  py-2 px-2 rounded mx-[1vw] cursor-pointer hover:bg-slate-600 mb-2"
          onClick={() => navigate("/likedSong")}
        >
          <img
            className="rounded size-12"
            src="https://misc.scdn.co/liked-songs/liked-songs-64.png"
            alt=""
          />
          <div className="pl-2 justify-between">
            <p className="font-bold text-white ">Bài hát đã thích</p>
          </div>
        </div>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="flex  py-2 px-2 mb-2 rounded mx-[1vw] cursor-pointer hover:bg-slate-600 "
            onClick={() => navigate(`/playlist/${playlist.id}`)}
          >
            <img
              className="rounded size-12"
              src={playlist.image_url_display}
              alt="playlist"
            />
            <div className="pl-2 justify-between">
              <p className="font-bold text-white ">{playlist.name}</p>
            </div>
            <div className=" ml-auto flex items-center">
              <FontAwesomeIcon
                icon={faTrash}
                className="text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn không cho navigate
                  handleDelete(playlist.id);
                }}
              />
            </div>
          </div>
        ))}
        {/* <div className="p-4 bg-[#242424] m-2 rounded font-bold flex flex-col items-start justify-start gap-1 pl-4 text-[16px]">
          <h1>Tạo danh sách đầu tiên của bạn</h1>
          <p className="font-light text-[14px]">Rất dễ! Chúng tôi sẽ giúp bạn</p>
          <button className="px-4 py-1.5 bg-white text-black rounded-full mt-4 hover:scale-105">Tạo danh sách phát</button>
        </div>

        <div className="p-4 bg-[#242424] m-2 rounded font-bold flex flex-col items-start justify-start gap-1 pl-4 text-[16px]">
          <h1>Hãy cùng tìm và theo dõi một số podcast</h1>
          <p className="font-light text-[14px]">Chúng tôi sẽ cập nhật cho bạn thông tin về các tập mới</p>
          <button className="px-4 py-1.5 bg-white text-black rounded-full mt-4 hover:scale-105">Duyệt xem podcasts</button>
        </div>
        <div className="p-4 bg-[#242424] m-2 mt-auto rounded flex flex-col gap-2">
          <textarea
            type="text"
            placeholder="Nhập nội dung..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-3 rounded bg-[#121212] text-white border border-gray-600 focus:outline-none focus:border-white resize-none"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition duration-200"
          >
            Gửi
          </button>

          {showThankYou && (
            <p className="text-green-400 font-medium mt-2">
              Cảm ơn bạn đã gửi tin nhắn!
            </p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
