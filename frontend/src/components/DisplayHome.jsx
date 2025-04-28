import Navbar from "./Navbar"
import Footer from "./Footer"
import AlbumItem from "./AlbumItem"
import SongItem from "./SongItem"
import  { useEffect, useState } from "react";





// eslint-disable-next-line react/prop-types
const DisplayHome = ( {handleMusicClick}) => {

  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/albums/")  
      .then(response => response.json())
      .then(data => setAlbums(data))
      .catch(error => console.error("Lỗi khi load albums:", error));
  }, []);

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/songs/")  
      .then(response => response.json())
      .then(data => setSongs(data))
      .catch(error => console.error("Lỗi khi load songs:", error));
  }, []);

  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/artists/")  
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.error("Lỗi khi load artists:", error));
  }, []);

  return (
    <>
    <Navbar/>
    <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Bảng xếp hạng nổi bật</h1>
        <div className="flex overflow-auto">
        {albums.map((item,index)=>(<AlbumItem key={index} name={item.title} desc={item.desc} id={item.id}
        image={item.image_url}/>))}
        </div>
    </div>
    <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Những bài hát thịnh hành</h1>
        <div className="flex overflow-auto">
      {songs.map((item)=>(<SongItem key={item.id} name={item.title} duration={item.duration} id={item.id}
        image={item.image_url} handleMusicClick={handleMusicClick}/>))}
        </div>
    </div>
    <div className="mb-4">
    <h1 className="my-5 font-bold text-3xl text-white">Nghệ sĩ phổ biến</h1>
<div className="flex gap-6 overflow-x-auto pb-4">
  {artists.map((item, index) => (
    <div
      key={index}
      className="min-w-[160px] bg-neutral-800 rounded-xl p-3 shadow-md hover:scale-105 transition-transform duration-300"
    >
      <img
        src={item.image_url}
        alt={item.name}
        className="w-full h-[160px] object-cover rounded-lg"
      />
      <div className="mt-3">
        <h2 className="text-white font-semibold text-lg truncate text-center" >{item.name}</h2>
        <p className="text-sm text-gray-400 truncate">{item.desc}</p>
      </div>
    </div>
  ))}
</div>

    </div>
    <Footer />
    </>
    
  )
}

export default DisplayHome