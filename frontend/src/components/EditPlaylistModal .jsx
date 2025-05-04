/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ACCESS_TOKEN } from "../constans";
import { toast } from "react-toastify";

const EditPlaylistModal = (props) => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleCreatePlaylist = async () => {
    const formData = new FormData();
    formData.append("name", playlistName);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image_url", imageFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/playlists/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Tạo thành công:", response.data);
      props.setIsOpenPlayList(false);
      toast.success(`Tạo playlist thành công`);
    } catch (error) {
      console.error("Lỗi tạo playlist:", error.response?.data || error);
    }
  };

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-neutral-800 rounded-lg p-6 w-full max-w-md relative"
      >
        {/* Close button */}
        <button
          onClick={() => {
            props.setIsOpenPlayList(false);
          }}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-6">
          Thêm danh sách phát
        </h2>

        {/* Content */}
        <div className="flex gap-4 mb-6">
          {/* Image upload */}
          <label className="w-40 h-40 bg-neutral-700 flex justify-center items-center rounded cursor-pointer overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Uploaded preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl text-gray-400">🎵</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Inputs */}
          <div className="flex flex-col flex-1 gap-4">
            <input
              type="text"
              placeholder="Danh sách phát của tôi"
              className="bg-neutral-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <textarea
              placeholder="Thêm phần mô tả không bắt buộc"
              className="bg-neutral-700 text-white p-3 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200"
            onClick={handleCreatePlaylist}
          >
            Lưu
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-400 mt-4">
          Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh
          bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình
          ảnh.
        </p>
      </motion.div>
    </div>
  );
};

export default EditPlaylistModal;
