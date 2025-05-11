/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import axios from "axios";
import { ACCESS_TOKEN } from "../constans";

const Video = () => {
  const { videoRef, track, isVideo } = useContext(PlayerContext);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [user, setUser] = useState(null);
  const commentsEndRef = useRef(null);

  // axios chỉ dùng để lấy comment ban đầu
  useEffect(() => {
    if (!track?.id) return;

    axios
      .get(`http://127.0.0.1:8000/api/comments/by-song/${track.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setComments(res.data))
      .catch((err) => console.error("Fetch comments error", err));

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/comments/${track.id}/?token=${token}`
    );
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setComments((prev) => {
        const exists = prev.some((c) => c.id === data.id);
        return exists ? prev : [...prev, data];
      });
    };

    return () => socket.close(); // đóng kết nối khi chuyển bài
  }, [track?.id]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Fetch comments error", err));
  }, [token]);

  const handleSend = () => {
    if (input.trim() === "" || !socketRef.current) return;
    if (socketRef.current.readyState === WebSocket.OPEN) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
      socketRef.current.send(
        JSON.stringify({ content: input, user: user?.id })
      );
    } else {
      console.warn("WebSocket chưa kết nối xong");
    }

    setInput("");
  };

  // định dạng lại thời gian "HH:MM DD/MM/YYYY"
  const formatDate = (isoStr) => {
    const date = new Date(isoStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  // tự động cuộn xuống cuối danh sách bình luận khi có bình luận mới
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white text-sm">
      <div className="relative bg-[#121212] h-full rounded flex flex-col justify-between py-4 px-4 overflow-hidden">
        <div className="flex-grow flex flex-col overflow-hidden">
          {isVideo ? (
            <>
              <video
                ref={videoRef}
                controls
                className="w-full h-auto max-h-[250px] object-contain"
              />
              <div className="font-bold mt-2 flex gap-2">
                <p>{track?.title}</p>
              </div>
            </>
          ) : (
            <>
              <img
                src={track?.image_url}
                alt="Cover"
                className="w-[80%] max-h-[200px] object-contain mx-auto"
              />
              <div className="font-bold mt-2 flex gap-2">
                <p>{track?.title}</p>
              </div>
            </>
          )}

          <div className="mt-4 overflow-y-auto flex-grow pr-1">
            <div className="sticky top-0 bg-[#121212] z-10 pb-2 border-t border-gray-700">
              <h3 className="font-bold">Bình luận</h3>
            </div>
            {comments.map((c, index) => (
              <div key={index} className="mb-2">
                <div className="text-sm">
                  <span className="text-green-400 font-semibold">
                    {c.user?.username}
                  </span>
                  <span className="text-gray-400 ml-2 text-xs">
                    {formatDate(c.created_at)}
                  </span>
                </div>
                <div className="break-words">{c.content}</div>
              </div>
            ))}
            <div ref={commentsEndRef} />

            {comments.length === 0 && (
              <div className="text-gray-500 text-sm">
                Chưa có bình luận nào về bài hát này!
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-700">
          <input
            placeholder="Nhập bình luận..."
            className="bg-[#242424] px-2 py-1 rounded flex-grow text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Video;
