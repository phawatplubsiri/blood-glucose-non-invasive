import { useState, useEffect } from "react";
import ESP from "./ValueFromESP";

// คอมโพเนนต์สำหรับแสดงสถานะเวลาปัจจุบัน และค่าจาก Sensor (ESP32)
function TimeHeader() {
  // state สำหรับเก็บเวลาปัจจุบัน ซึ่งจะถูกอัปเดตทุกวินาที
  const [currentTime, setCurrentTime] = useState(new Date());

  // Hook ที่จะทำงานครั้งเดียวเมื่อ component ถูกสร้างขึ้น (mount)
  useEffect(() => {
    // สร้าง interval เพื่อสั่งอัปเดต state `currentTime` ทุกๆ 1 วินาที
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Cleanup function: จะถูกเรียกเมื่อ component ถูกทำลาย (unmount)
    // เพื่อยกเลิก interval ป้องกัน memory leak
    return () => clearInterval(interval);
  }, []); // dependency array ที่ว่าง หมายถึงให้ effect นี้ทำงานแค่ครั้งเดียวตอนเริ่มต้น

  // จัดรูปแบบการแสดงผลของวันที่และเวลาเป็นภาษาไทย
  const formattedDate = currentTime.toLocaleDateString("th-TH");
  const formattedTime = currentTime.toLocaleTimeString("th-TH");

  return (
    <div className="p-4 rounded-md flex flex-col items-center text-[18px]">
      <span className="text-[25px] mt-1 mb-3 ">ค่าสถานะจาก ESP32</span>
      <div className="text-center space-y-1">
        <span className="block">วันที่ : {formattedDate}</span>
        <span className="block">เวลา : {formattedTime}</span>
      </div>
      <ESP />
    </div>
  );
}

export default TimeHeader;