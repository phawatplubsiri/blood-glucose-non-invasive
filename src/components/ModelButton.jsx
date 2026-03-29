import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// คอมโพเนนต์สำหรับแสดงปุ่มที่นำทางไปยังหน้าแสดงผลโมเดล
function ModelDisplay() {

  // ฟังก์ชันที่จะทำงานเมื่อผู้ใช้คลิกปุ่ม
  const handleClick = () => {
    // ใช้ SweetAlert2 เพื่อแสดง pop-up แจ้งเตือนชั่วคราว
    Swal.fire({
      title: "Going to Model Display",
      timer: 1000, // กำหนดให้ pop-up แสดงเป็นเวลา 1 วินาที
      timerProgressBar: true,
      background: "#f7d9d9",
      customClass: {
        title: "font-mitr",
      },
      didOpen: () => {
        Swal.showLoading();
      },
      // didClose: ฟังก์ชันที่จะทำงานหลังจากที่ pop-up ปิดลง
      didClose: () => {
        // เปิดหน้า '/model-dashboard' ในแท็บใหม่ของเบราว์เซอร์
        window.open("/model-dashboard", "_blank");
      },
    });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-7 py-3 rounded-full border-2 border-black text-black text-[20px]  cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#f7d9d9] to-[#f48b9a] hover:bg-gradient-to-tl w-full md:w-auto"
      >
        เข้าสู่หน้าโมเดล
      </button>
    </>
  );
}

export default ModelDisplay;