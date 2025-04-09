import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex text-sm">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div onClick={()=>navigate('/')} className="flex items-center gap-3 pl-8 cursor-pointer">
          <img className="w-6" src={assets.home_icon} alt="" />
          <p className="font-bold">Trang Chủ</p>
        </div>

        <div className="flex items-center gap-3 pl-8 cursor-pointer">
          <img className="w-6" src={assets.search_icon} alt="" />
          <p className="font-bold">Tìm Kiếm</p>
        </div>
      </div>

      <div className="bg-[#121212] h-[85%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="relative group w-fit">
            <button className="flex items-center gap-3">
              <img className="w-6" src={assets.stack_icon} alt="stack_icon" />
              <p className="font-bold text-[18px]">Thư viện</p>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-black rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap">
              Thu gọn thư viện
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-[#242424] rounded-full cursor-pointer hover:brightness-125 transition duration-200">
                <img className="w-3" src={assets.plus_icon} alt="plus_icon" />
                <span className="text-sm font-semibold">Tạo</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-black text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
                Tạo danh sách, thư mục hoặc Jam
              </div>
            </div>
    
            <div className="relative group">
              <button className="p-2 rounded-full border border-transparent hover:bg-white/20 group transition duration-200">
                <img
                  className="w-4 brightness-90 group-hover:brightness-200 transition duration-200"
                  src={assets.arrow_icon}
                  alt="arrow_icon"
                />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-black text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap pointer-events-none">
                Xem thêm
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#242424] m-2 rounded font-bold flex flex-col items-start justify-start gap-1 pl-4">
            <h1>Tạo danh sách đầu tiên của bạn</h1>
            <p className="font-light">Rất dễ! Chúng tôi sẽ giúp bạn</p>
            <button className="px-4 py-1.5 bg-white text-black rounded-full mt-4 hover:scale-105">Tạo danh sách phát</button>
        </div>
        <div className="p-4 bg-[#242424] m-2 rounded font-bold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
            <h1>Hãy cùng tìm và theo dõi một số podcast</h1>
            <p className="font-light">Chúng tôi sẽ cập nhật cho bạn thông tin về các tập mới</p>
            <button className="px-4 py-1.5 bg-white text-black rounded-full mt-4 hover:scale-105">Duyệt xem podcasts</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
