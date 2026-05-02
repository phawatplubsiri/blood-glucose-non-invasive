import React from "react";
import { FileQuestion, Loader2, AlertCircle } from "lucide-react";

/**
 * Component สำหรับแสดงสถานะ Loading
 */
export const LoadingState = ({ message = "กำลังโหลดข้อมูล..." }) => (
  <div className="flex flex-col items-center justify-center p-10 w-full animate-pulse min-h-[200px]">
    <Loader2 className="w-10 h-10 text-[#f48b9a] animate-spin mb-3" />
    <p className="text-gray-500 font-mitr text-lg">{message}</p>
  </div>
);

/**
 * Component สำหรับแสดงสถานะเมื่อไม่พบข้อมูล (Empty/Not Found)
 */
export const NotFoundState = ({ 
  message = "ไม่พบข้อมูล"
}) => (
  <div className="flex flex-col items-center justify-center p-10 w-full border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 min-h-[200px]">
    <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-gray-50">
      <FileQuestion className="w-10 h-10 text-gray-300" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 font-mitr">{message}</h3>
  </div>
);

/**
 * Component สำหรับแสดงข้อความ Error
 */
export const ErrorState = ({ 
  message = "เกิดข้อผิดพลาด"
}) => (
  <div className="flex flex-col items-center justify-center p-10 w-full border border-red-100 rounded-2xl bg-red-50/30 min-h-[200px]">
    <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-red-50">
      <AlertCircle className="w-10 h-10 text-red-300" />
    </div>
    <h3 className="text-xl font-semibold text-red-700 font-mitr">{message}</h3>
  </div>
);
