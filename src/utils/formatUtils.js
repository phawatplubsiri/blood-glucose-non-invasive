// แปลงค่า (string หรือ number) ให้เป็นเลขทศนิยม (float) ที่มี 2 ตำแหน่งเสมอ
export const toFloat = (val) => Number(parseFloat(val).toFixed(2));

// สำหรับสร้าง ID และ timestamp จากเวลาและวันที่ปัจจุบัน
export const getRecord = () => {
  const now = new Date(); // ดึงเวลาและวันที่ปัจจุบันจากระบบ
  
  // Helper function สำหรับทำ zero-padding
  const pad = (num, size = 2) => String(num).padStart(size, "0");

  // สร้าง record_id ที่ไม่ซ้ำกันในรูปแบบ YYYYMMDD_HHMMSS เพื่อให้ง่ายต่อการเรียงลำดับ
  const record_id = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  
  // จัดรูปแบบวันที่เป็น DD/MM/YYYY 
  const record_day = now.toLocaleDateString("en-GB");
  
  // จัดรูปแบบเวลาเป็น HH:MM:SS 
  const record_time = now.toLocaleTimeString("en-GB");

  // return ค่าทั้งหมดในรูปแบบ object
  return { record_id, record_day, record_time };
};