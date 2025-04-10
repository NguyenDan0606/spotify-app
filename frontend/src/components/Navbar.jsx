const Navbar = () => {
  return (
    <>
      <div className="flex items-center gap-2 font-semibold">
        <button className="bg-white text-black px-4 py-1 rounded-2xl hover:scale-105 transition">Tất cả</button>
        <button className="bg-[#242424] text-white px-4 py-1 rounded-2xl hover:scale-105 transition">Âm nhạc</button>
        <button className="bg-[#242424] text-white px-4 py-1 rounded-2xl hover:scale-105 transition">Podcasts</button>
      </div>
    </>
  );
};

export default Navbar;
