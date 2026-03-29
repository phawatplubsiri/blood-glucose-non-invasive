import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Navlogo from '../assets/bg-logo.png'
import { auth } from "../configs/firebaseConfigs";
import { signOut } from "firebase/auth";

// คอมโพเนนต์ Navbar ที่จะแสดงผลแตกต่างกันไปตามหน้าเพจ
function Navbar() {
   // Hooks สำหรับเข้าถึงข้อมูล URL ปัจจุบัน และฟังก์ชันสำหรับเปลี่ยนหน้า
  const location = useLocation();
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = () => {
    Swal.fire({
      title: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f48b9a",
      cancelButtonColor: "#grey",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      background: "#f7d9d9",
      customClass: {
        title: "font-mitr",
        popup: "font-mitr",
        confirmButton: "font-mitr",
        cancelButton: "font-mitr",
        htmlContainer: "font-mitr",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth).then(() => {
          Swal.fire({
            icon: "success",
            iconColor: "green",
            title: "ออกจากระบบสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
            background: "#f7d9d9",
            customClass: {
              title: "font-mitr",
              popup: "font-mitr",
            },
          });
          navigate("/login");
        });
      }
    });
  };

  // ฟังก์ชันสำหรับแสดง pop-up คู่มือการใช้งาน (จะทำงานเฉพาะเมื่ออยู่ที่หน้าหลัก "/")
  const manualClick = () => {
    // ถ้าไม่ได้อยู่ที่หน้าหลัก ให้จบการทำงานฟังก์ชันทันที
    if (location.pathname !== "/") return;

    // แสดง pop-up ด้วย SweetAlert2
    Swal.fire({
      title: "คู่มือการใช้งานเว็บบันทึกข้อมูล",
      html: `
        <ol style="list-style: decimal inside">
          <li>กรอกข้อมูลของผู้ป่วยหลังให้ครบถ้วน โดยจะกรอกได้เฉพาะตัวเลขและจุดเท่านั้น</li>
          <li>หากกรอกไม่ครบจะมีการแจ้งเตือนจากช่องนั้น</li>
          <li>เมื่อกดบันทึกจะมีการแจ้งเตือนให้ยืนยันอีกรอบ พร้อมกับแสดงค่าที่ผู้ใช้งานได้ทำการกรอก</li>
          <li>หากตรวจสอบเรียบร้อยและถูกต้องครบถ้วน จึงทำการกด "ยืนยัน" เพื่อบันทึกข้อมูล</li>
          <li>ขณะกรอกข้อมูล สามารถกดปุ่ม "ล้างค่า" ได้หากต้องการลบข้อมูลทุกช่องภายในหนึ่งครั้ง</li>
        </ol>
      `,
      icon: "info",
      iconColor: "grey",
      background: "#f7d9d9",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#f48b9a",
      customClass: {
        title: "font-mitr",
        popup: "font-mitr",
        confirmButton: "font-mitr",
        htmlContainer: "font-mitr",
      },
    });
  };

  // ฟังก์ชันสำหรับพาผู้ใช้ไปยังหน้าแก้ไขข้อมูล
  const handleClick = () => {
    navigate("/edit-data"); 
  };

  // ฟังก์ชันสำหรับเปลี่ยนข้อความ Title ของ Navbar ตาม URL ปัจจุบัน
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "หน้าบันทึกข้อมูลผู้ป่วยหลังการตรวจ";

      default:
        return "หน้าแดชบอร์ดแสดงผลการเรียนรู้โมเดล";
    }
  };

  return (
  <div className="w-full bg-[#f48b9a] text-black px-2 py-2 flex items-center gap-2 md:px-6 font-mitr">
    <img
      src={Navlogo}
      alt="logo"
      className="h-[50px] w-[50px] md:h-[80px] md:w-[80px] rounded-full border-2 md:border-3 border-black cursor-pointer ml-1 md:ml-2 shrink-0"
      onClick={manualClick}
    />
    <span className="title-detail leading-tight flex-1 text-[15px] sm:text-[18px] md:text-[22px] font-medium">
      {getTitle()}
    </span>

    <div className="flex items-center gap-2 ml-auto">
      {location.pathname === "/" && (
        <button
          onClick={handleClick}
          className="px-3 py-1.5 md:px-4 md:py-2 border-2 rounded-4xl border-black text-black text-[14px] md:text-[20px] cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#f7d9d9] to-[#f48b9a] hover:bg-gradient-to-tl shrink-0"
        >
          แก้ไขข้อมูล
        </button>
      )}
      
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 md:px-4 md:py-2 border-2 rounded-4xl border-black text-white text-[14px] md:text-[20px] cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#e74c3c] to-[#c0392b] hover:bg-gradient-to-tl hover:shadow-md shrink-0"
      >
        ออกจากระบบ
      </button>
    </div>
  </div>
);
}

export default Navbar;