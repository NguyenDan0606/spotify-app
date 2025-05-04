import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-extrabold text-green-500 mb-4">403</h1>
        <h2 className="text-2xl font-bold mb-2">Không có quyền truy cập</h2>
        <p className="text-gray-300 mb-6">
          Bạn không đủ quyền để truy cập trang này. Nếu bạn nghĩ đây là nhầm lẫn, hãy liên hệ quản trị viên.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full transition duration-200"
        >
          Quay lại Trang chủ
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
