/* eslint-disable react/prop-types */
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const Video = () => {
  const { videoRef, track, isVideo } = useContext(PlayerContext);

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white text-sm">
      <div className="relative bg-[#121212] h-[100%] rounded  items-center justify-center py-4 px-4">
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              controls={true}
              className="w-[100%] max-h-[80%] object-contain"
            />
            <div className="font-bold mt-2 flex gap-2">
              <p className="">{track?.title}</p>
            </div>
          </>
        ) : (
          <>
            <img
              src={track?.image_url}
              alt="Cover"
              className="w-[80%] max-h-[80%] object-contain"
            />
            <div className="font-bold mt-2 flex gap-2">
              <p className="">{track?.title}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Video;
