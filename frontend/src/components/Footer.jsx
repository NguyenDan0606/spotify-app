import { assets } from "../assets/assets";

const Footer = () => {
    return (
        <footer className="text-white px-10 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-gray-500 pb-10">
                <div>
                    <h3 className="font-bold mb-4">Công Ty</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Giới thiệu</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Việc làm</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">For the Record</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Cộng đồng</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Dành cho các Nghệ sĩ</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Nhà phát triển</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Quảng cáo</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Nhà đầu tư</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Nhà cung cấp</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Liên kết hữu ích</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Hỗ trợ</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Ứng dụng Di Động Miễn phí</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Các gói của Spotify</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Premium Individual</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Premium Student</a></li>
                        <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Spotify Free</a></li>
                    </ul>
                </div>
                <div className="flex space-x-4 mb-4 md:mb-0">
                    <a href="https://www.instagram.com/spotify" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-neutral-500 group transition duration-300"
                    >
                        <img 
                            src={assets.instagram_icon} 
                            alt="instagram" 
                            className="w-3 h-3 filter group-hover:brightness-0 group-hover:invert transition duration-300 invert"
                        />
                    </a>
                    <a href="https://x.com/spotify" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-neutral-500 group transition duration-300"
                    >
                        <img 
                            src={assets.twitter_icon} 
                            alt="twitter" 
                            className="w-3 h-3 filter group-hover:brightness-0 group-hover:invert transition duration-300 invert"
                        />
                    </a>
                    <a href="https://www.facebook.com/SpotifyVietnam/?brand_redir=6243987495#" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-neutral-500 group transition duration-300"
                    >
                        <img 
                            src={assets.facebook_icon} 
                            alt="facebook" 
                            className="w-3 h-3 filter group-hover:brightness-0 group-hover:invert transition duration-300 invert"
                        />
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <ul className="flex flex-wrap justify-center md:justify-end space-x-4 text-sm">
                    <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Pháp lý</a></li>
                    <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Trung tâm an toàn và quyền riêng tư</a></li>
                    <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Chính sách quyền riêng tư</a></li>
                    <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Cookie</a></li>
                    <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Giới thiệu Quảng cáo</a></li>
                    <li className="hover:text-white hover:underline"><a href="https://github.com/NguyenDan0606/spotify-app" target="_blank" rel="noopener noreferrer">Hỗ trợ tiếp cận</a></li>
                </ul>
                <p className="mt-4 md:mt-0">&copy; 2025 Spotify AB</p>
            </div>
        </footer>
    );
};

export default Footer;
