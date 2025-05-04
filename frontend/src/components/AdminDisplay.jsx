import PropTypes from "prop-types";

const AdminDisplay = ({ selectedMenu }) => {
  const renderContent = () => {
    if (!selectedMenu) {
      return (
        <div className="p-4 text-center text-2xl text-green-400 font-semibold">
          👋 Chào mừng bạn đã đến trang Admin
        </div>
      );
    }
  };

  return (
    <div className="w-[100%] h-full flex-col gap-2 text-white flex text-sm">
      <div className="bg-[#121212] h-[100%] rounded-lg overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

AdminDisplay.propTypes = {
  selectedMenu: PropTypes.string.isRequired,
};

export default AdminDisplay;
