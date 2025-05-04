import { useNavigate } from "react-router-dom"


// eslint-disable-next-line react/prop-types
const AlbumItem = ({image,name,desc,id}) => {

  const navigate = useNavigate()
  return (
    <div onClick={()=>navigate(`/album/${id}`)} 
        className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
        <img 
          className="w-[156px] h-[156px] object-cover rounded"  
          src={image} 
          alt="image" 
        />
        <p className="font-bold mt-2 mb-1 text-center">{name}</p>
        <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  )
}

export default AlbumItem