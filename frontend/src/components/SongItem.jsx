/* eslint-disable react/prop-types */
import { useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"

const SongItem = (props) => {
  const formatMinutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes}`;
  };

  const handleClick = () => {
    playWithId(props.id);
    props.handleMusicClick();
  }
  const {playWithId} = useContext(PlayerContext)
  return (
    <div onClick={handleClick} className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
        <img className="rounded" src={props.image} alt="" />
        <p className="font-bold mt-2 mb-1">{props.name}</p>
        <p className="text-slate-200 text-sm">{formatMinutesToTime(props.duration)}</p>
    </div>
  )
}

export default SongItem