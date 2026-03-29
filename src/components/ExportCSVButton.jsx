import { getDocs, collection } from "firebase/firestore";
import { getRecord } from "../utils/formatUtils";
import { db } from "../configs/firebaseConfigs";

// ปุ่มโหลดข้อมูลเป็นไฟล์ CSV
const ExportCSVButton = () => {
  // ตอนคลิกปุ่ม
  const exportToCSV = async () => {
    // ดึงข้อมูลทั้งหมดจาก collection "MLDataset"
    const queryDataset = await getDocs(collection(db, "MLDataset"));
    const rows = [];
    queryDataset.forEach((doc) => {
      rows.push(doc.data());
    });

    // แปลงข้อมูลเป็น CSV
    const csvConvert = convertToCSV(rows);

    // เอา record_id มาทำชื่อไฟล์
    const { record_id } = getRecord();
    let exportId = record_id.slice(0, 8);

    // สร้างลิงก์ให้โหลดไฟล์ CSV
    const blob = new Blob([csvConvert], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Dataset_${exportId}.csv`);
    link.click(); // สั่งโหลดเลย
  };

  // ฟังก์ชันแปลง object → CSV string
  function convertToCSV(data) {
    if (data.length === 0) return "";

    // ชื่อคอลัมน์
    const headers = [
      "record_id", "analog_value", "currents", "voltage", "glucose_meter",
      "heart_rate", "systolic", "diastolic", "age", "gender", "weight", "height",
    ];
    
    // รวมเป็น string แบบ CSV
    const csvRows = [
      headers.join(","), // แถวหัวตาราง
      ...data.map((row) =>
        headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
      ),
    ];
    
    return csvRows.join("\n"); // ต่อบรรทัด
  }
  
  return (
    <button onClick={exportToCSV} className="cursor-pointer">
      Export CSV
    </button>
  );
};

export default ExportCSVButton;
