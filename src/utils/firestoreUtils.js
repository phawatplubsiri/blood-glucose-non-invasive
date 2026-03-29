import { collection, getDocs } from "firebase/firestore";
import { db } from "../configs/firebaseConfigs"; 

// Utility function: สำหรับสร้าง Train ID ใหม่ในรูปแบบ 'record_XXX' โดยหาเลข ID ที่มากที่สุดแล้วบวก 1
export const getNextTrainId = async () => {
  const prefix = `record_`; // คำนำหน้าของ ID ที่ต้องการ

  // ดึงข้อมูล document ทั้งหมดจาก collection "MLDataset"
  const allDocs = await getDocs(collection(db, "MLDataset"));

  // ประมวลผล ID ทั้งหมดเพื่อหาเลขลำดับที่มากที่สุด
  const usedIds = allDocs.docs
    // ดึงเฉพาะ ID ของแต่ละ document ออกมาเป็น array
    .map((doc) => doc.id)
    // กรองเอาเฉพาะ ID ที่ขึ้นต้นด้วย "record_"
    .filter((id) => id.startsWith(prefix))
    // ตัดคำว่า "record_" ออก แล้วแปลงส่วนที่เป็นตัวเลขให้เป็น Integer
    .map((id) => parseInt(id.replace(prefix, ""), 10))
    // กรองค่าที่ไม่ใช่ตัวเลขออกไป (เผื่อกรณีมี ID ที่มีรูปแบบผิดพลาด)
    .filter((num) => !isNaN(num));

  // หาเลขที่มากที่สุดใน `usedIds` แล้วบวก 1 เพื่อเป็นเลขลำดับถัดไป
  // ใช้ Math.max(0, ...usedIds) เพื่อให้แน่ใจว่าถ้ายังไม่มีข้อมูลเลย ค่าเริ่มต้นจะเป็น 0 แล้ว + 1
  const nextNumber = Math.max(0, ...usedIds) + 1;

  // สร้าง ID ใหม่โดยนำ prefix มาต่อกับเลขที่ได้ และทำการ zero-padding ให้ครบ 3 หลัก
  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
};