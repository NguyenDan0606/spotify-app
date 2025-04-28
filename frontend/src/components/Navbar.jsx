
const Navbar = () => {

  return (
    <div className="sticky top-0 bg-black/50 backdrop-blur-md">
      <div className="flex items-center gap-2 font-semibold px-4 py-4">
         <button className="bg-white text-black px-4 py-1 rounded-2xl hover:scale-105 transition">Tất cả</button>
         <button className="bg-[#242424] text-white px-4 py-1 rounded-2xl hover:scale-105 transition">Âm nhạc</button>
         <button className="bg-[#242424] text-white px-4 py-1 rounded-2xl hover:scale-105 transition">Podcasts</button>
       </div>
    </div>
  );
};

export default Navbar;
