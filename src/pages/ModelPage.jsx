import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MLRPage from "./MLRPage";
import DecisionTreePage from "./DecisionTreePage";
import RandomForestPage from "./RandomForestPage";
import DNNPage from "./DNNPage";
import CNNPage from "./CNNPage";

// จัดการ Navbar, Sidebar และการสลับหน้า Content ตาม URL
const ModelPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { modelName } = useParams();
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับสลับค่า state การเปิด/ปิด Sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Callback function ที่จะส่งให้ Sidebar: เมื่อมีการเลือกโมเดลใน Sidebar
  const handleSelectModel = (name) => {
    navigate(`/model-dashboard/${name}`);
    setSidebarOpen(false);
  };

  // ฟังก์ชันสำหรับเลือก Page component ที่จะ render โดยดูจาก `modelName` ใน URL
  const renderModel = () => {
    switch (modelName) {
      case "multiple-linear-regression":
        return <MLRPage />;
      case "decision-tree":
        return <DecisionTreePage />;
      case "random-forest":
        return <RandomForestPage />;
      case "deep-neural-network":
        return <DNNPage />;
      case "convolutional-neural-network":
        return <CNNPage />;
      default:
        // กรณีที่ไม่ตรงกับ case ไหนเลย (เช่น เข้ามาครั้งแรก) ให้แสดงข้อความแนะนำ
        return (
          <div className="flex justify-center text-center text-4xl mt-80 ">
            <p className="bg-[#f3d7d7] p-6 rounded-3xl transfrom animate-bounce">
              กรุณาเลือกโมเดลที่ต้องการให้แสดงข้อมูลที่แถบ Side Bar
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-mitr relative">
      {/* Navbar แบบ Fixed ด้านบนสุด */}
      <div className="bg-[#f48b9a] flex items-center px-2 md:px-4 fixed top-0 left-0 right-0 z-50 shadow-md">
        {/* ปุ่ม Hamburger Menu สำหรับเปิด/ปิด Sidebar */}
        <button
          onClick={toggleSidebar}
          className={`text-2xl md:text-3xl cursor-pointer rounded px-2 py-1 md:px-3 md:py-1 transition-transform duration-300 z-[60] ${
            isSidebarOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
        <div className="flex-1 overflow-hidden">
          <Navbar />
        </div>
      </div>

      {/* Overlay: พื้นหลังสีดำโปร่งแสงที่จะแสดงเมื่อ Sidebar เปิด */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/10 bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component: ถูกควบคุมการแสดงผลด้วย state `isSidebarOpen` */}
      <Sidebar
        isOpen={isSidebarOpen}
        onSelectModel={handleSelectModel}
        selectedModel={modelName || ""}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 pt-[66px] md:pt-[96px] px-2 md:px-4 z-0">{renderModel()}</div>
    </div>
  );
};

export default ModelPage;
