import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Custom Hook สำหรับเปลี่ยน Title ของหน้าเว็บ (Browser Tab) แบบ Dynamic ตาม URL
function useDynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    // ตรวจสอบ pathname ปัจจุบันและตั้งค่า document.title ให้สอดคล้องกัน
    if (location.pathname === "/") {
      document.title = "Home | หน้าบันทึกข้อมูลผู้ป่วย";
    } else if (location.pathname === "/edit-data") {
      document.title = "Edit | หน้าแก้ไขข้อมูล";
    } else if (location.pathname.startsWith("/model")) { // เช็กว่า path เริ่มต้นด้วย "/model" หรือไม่
      document.title = "Dashboard | หน้าแดชบอร์ดการเรียนรู้ของโมเดล";
    } else if (location.pathname === "/login") {
      document.title = "Login | หน้าเข้าสู่ระบบ";
    } else {
      document.title = "Not Found Title";
    }
  }, [location.pathname]); // Dependency: ให้ effect นี้ทำงานใหม่เมื่อ pathname เปลี่ยนเท่านั้น
}

export default useDynamicTitle;