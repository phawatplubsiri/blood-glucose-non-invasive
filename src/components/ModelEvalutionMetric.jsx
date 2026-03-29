import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebaseConfigs";
import { Info } from "lucide-react";

// 🔹 Tooltip ใช้แสดงคำอธิบายเมื่อเอาเมาส์ชี้
function Tooltip({ content }) {
  return (
    <div className="relative group cursor-pointer inline-block ml-2">
      <Info size={16} className="text-gray-500" />
      {/* กล่อง tooltip โผล่ตอน hover */}
      <div className="absolute left-1/2 -translate-x-2/4 bottom-full hidden w-65 rounded bg-[#e6b2b9] text-black px-2 py-1 text-xs group-hover:block shadow-lg opacity-85 text-left">
        {content}
      </div>
    </div>
  );
}

// 🔹 ส่วนหลักของคอมโพเนนต์ — ใช้โชว์ผลลัพธ์การประเมินโมเดล
export default function ModelEvalutionMetric({ collectionName, runId, modelType }) {
  const [metrics, setMetrics] = useState(null); // เก็บค่าตัวชี้วัด (MAE, MSE, R² ฯลฯ)
  const [notFound, setNotFound] = useState(false); // ใช้เช็กว่ามี document หรือไม่

  useEffect(() => {
    // ดึงข้อมูลแบบเรียลไทม์จาก Firestore
    const unsub = onSnapshot(doc(db, collectionName, runId), (docSnap) => {
      if (docSnap.exists()) {
        setMetrics(docSnap.data()); // ถ้ามี document ให้เก็บข้อมูลไว้
        setNotFound(false);
      } else {
        setNotFound(true); // ถ้าไม่เจอ document
      }
    });
    return () => unsub(); // cleanup listener ตอน component ถูกถอด
  }, [collectionName, runId]);

  // ถ้าไม่เจอ document
  if (notFound)
    return (
      <div className="text-center text-red-500 mt-4">
        ไม่พบ Document ใน Firestore
      </div>
    );

  // ถ้ายังโหลดไม่เสร็จ
  if (!metrics) return <div>Loading metrics...</div>;

  // ข้อความอธิบายไว้ใน tooltip
  const infoContent = (
    <div className="space-y-1">
      <p><strong>Raw Data:</strong> จำนวนข้อมูลทั้งหมดที่มีอยู่</p>
      <p><strong>Train Data:</strong> จำนวนข้อมูลที่ใช้ฝึกโมเดล</p>
      <p><strong>MAE:</strong> ค่าคลาดเฉลี่ยแบบสัมบูรณ์</p>
      <p><strong>MSE:</strong> ค่าคลาดเฉลี่ยกำลังสอง</p>
      <p><strong>R²:</strong> ค่าความสามารถของโมเดลในการอธิบายข้อมูล</p>
      {/* ถ้าไม่ใช่ Decision Tree (DT) หรือ Random Forest (RF) ค่อยโชว์ Epochs */}
      {(modelType !== "DT" && modelType !== "RF") && (
        <p><strong>Epochs:</strong> จำนวนรอบที่โมเดลถูกฝึก</p>
      )}
    </div>
  );

  return (
    <div className="text-center">
      {/* หัวข้อ + Tooltip */}
      <h2 className="text-lg mb-2 text-pink-600 flex items-center justify-center">
        Model Status
        <Tooltip content={infoContent} />
      </h2>

      {/* แสดงค่าตัวชี้วัดของโมเดล */}
      <ul className="space-y-1">
        <li>Raw Data: {metrics.raw_data.toFixed(0)}</li>
        <li>Train Data: {metrics.data_train.toFixed(0)}</li>
        <li>MAE: {metrics.MAE.toFixed(4)}</li>
        <li>MSE: {metrics.MSE.toFixed(4)}</li>
        <li>R²: {metrics.R2.toFixed(4)}</li>
        {/* โชว์ Epochs เฉพาะโมเดลที่เป็น neural network */}
        {(modelType !== "DT" && modelType !== "RF") && (
          <li>Epochs: {metrics.epochs.length.toFixed(0)}</li>
        )}
      </ul>
    </div>
  );
}
