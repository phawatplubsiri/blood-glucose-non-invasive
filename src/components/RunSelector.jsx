import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../configs/firebaseConfigs";

// คอมโพเนนต์สำหรับสร้าง Dropdown เพื่อเลือกเวอร์ชัน (Run ID) ของโมเดลที่ถูกเลือก
function RunSelector({ selectedModel, selectedRun, setSelectedRun }) {
  // state สำหรับเก็บรายการ Run ID ทั้งหมดที่ดึงมาจาก Firestore
  const [runs, setRuns] = useState([]);

  // Hook ที่จะทำงานทุกครั้งเมื่อ `selectedModel` มีการเปลี่ยนแปลง
  useEffect(() => {
    // ถ้ายังไม่มีการเลือกโมเดล ให้หยุดการทำงาน
    if (!selectedModel) return;

    // ฟังก์ชันสำหรับดึงข้อมูล Run ID ทั้งหมดจาก Firestore
    const fetchRuns = async () => {
      try {
        // ดึงข้อมูล document ทั้งหมดจาก collection ที่ระบุโดย `selectedModel`
        const runsCol = collection(db, selectedModel);
        const snapshot = await getDocs(runsCol);

        // นำ ID ของแต่ละ document มาเก็บไว้ใน array เพื่อใช้เป็นตัวเลือกใน dropdown
        const runIds = snapshot.docs.map((doc) => doc.id);
        setRuns(runIds);
      } catch (err) {
        console.error("Error fetching runs:", err);
      }
    };

    fetchRuns();
  }, [selectedModel]);

  return (
    <div className="mb-4 text-center">
      <label className="mr-2 font-medium">เลือกเวอร์ชันโมเดล:</label>
      <select
        value={selectedRun} // แสดงค่าที่ถูกเลือกปัจจุบัน
        onChange={(e) => setSelectedRun(e.target.value)} // เมื่อมีการเปลี่ยนค่า เรียกฟังก์ชันจาก parent component
        className="rounded border border-gray-600 bg-white px-2 py-1 text-sm"
      >
        {/* ตรวจสอบว่ามีข้อมูล runs หรือไม่ เพื่อแสดงผลแบบมีเงื่อนไข */}
        {runs.length > 0 ? (
          // ถ้ามี: วนลูปสร้าง <option> จากรายการ Run ID
          runs.map((runId) => (
            <option key={runId} value={runId}>
              {runId}
            </option>
          ))
        ) : (
          // ถ้าไม่มี: แสดงตัวเลือก "ไม่มีข้อมูล"
          <option disabled>ไม่มีข้อมูล</option>
        )}
      </select>
    </div>
  );
}

export default RunSelector;