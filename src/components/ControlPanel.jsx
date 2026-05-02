import React from "react";
import { ChevronRight, ChevronLeft, Settings, X } from "lucide-react";

/**
 * Component สำหรับแผงควบคุม
 * - Desktop: เป็น Sidebar ด้านข้าง (ยืด-หดได้)
 * - Mobile: เป็น Floating Button ที่กดแล้วขึ้น Modal
 */
const ControlPanel = ({ children, isOpen, setIsOpen }) => {
  return (
    <>
      {/* --- Desktop Version (Sidebar) --- */}
      <div 
        className={`hidden lg:block transition-all duration-300 ease-in-out h-fit sticky top-24 md:top-28
          ${isOpen ? "w-[350px]" : "w-[70px]"}
        `}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-4 flex items-center justify-between hover:bg-pink-50/50 transition-colors border-b border-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${isOpen ? "bg-[#f48b9a] text-white" : "bg-pink-100 text-[#f48b9a]"}`}>
                <Settings size={20} className={isOpen ? "animate-spin-slow" : ""} />
              </div>
              {isOpen && (
                <span className="font-semibold text-gray-700 font-mitr whitespace-nowrap">
                  แผงควบคุม
                </span>
              )}
            </div>
            <div className="text-gray-400">
              {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </div>
          </button>

          {/* Content Area */}
          <div className={`transition-all duration-300 ${isOpen ? "max-h-[2000px] opacity-100 p-4" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <div className="space-y-8">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* --- Mobile Version (Floating Button + Modal) --- */}
      <div className="lg:hidden">
        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-[110] p-4 bg-[#f48b9a] text-white rounded-full shadow-2xl active:scale-95 transition-all border-2 border-white cursor-pointer"
        >
          <Settings size={28} className="animate-spin-slow" />
        </button>

        {/* Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-3xl sm:rounded-2xl shadow-xl overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="p-4 flex items-center justify-between border-b bg-pink-50/30">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-[#f48b9a]" />
                  <span className="font-bold text-gray-700 font-mitr">ตั้งค่าและสถานะโมเดล</span>
                </div>
                {/* ลบปุ่ม X ออกตามความต้องการ โดยให้ไปกดที่ปุ่มลอยแทน */}
              </div>

              {/* Scrollable Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-8 font-mitr">
                {children}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ControlPanel;
