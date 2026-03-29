import React from "react";
import colablogo from '../assets/colab-logo.png'
import drivelogo from '../assets/drive-logo.png'

function ColabDriveLinks({ colabLink, driveLink }) {
  return (
    <div className="flex items-center justify-center mt-2 gap-10">
      
      {/* ส่วนของลิงก์ Google Colab */}
      <div className="flex flex-col items-center text-center">
        <a
          href={colabLink}
          target="_blank" // กำหนดให้เปิดลิงก์ในแท็บใหม่
          rel="noopener noreferrer" // ป้องกันปัญหาด้านความปลอดภัยเมื่อเปิดแท็บใหม่
        >
          <img
            src={colablogo}
            alt="Open in Colab"
            className="w-44 cursor-pointer transition-transform hover:scale-120 hover:opacity-90"
          />
        </a>
        <span className="text-sm font-medium">หน้าฝึกฝนโมเดล</span>
      </div>

      {/* ส่วนของลิงก์ Google Drive */}
      <div className="flex flex-col items-center text-center">
        <a
          href={driveLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={drivelogo}
            alt="Download Model"
            className="w-24 cursor-pointer transition-transform hover:scale-120 hover:opacity-90"
          />
        </a>
        <span className="mt-5 text-sm font-medium">หน้าดาวน์โหลดโมเดล</span>
      </div>
      
    </div>
  );
}

export default ColabDriveLinks;