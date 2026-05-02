import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebaseConfigs";
import { Info } from "lucide-react";

import { LoadingState, NotFoundState } from "./StatusMessage";

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
      <NotFoundState 
        message="ไม่พบข้อมูลโมเดล" 
      />
    );

  // ถ้ายังโหลดไม่เสร็จ
  if (!metrics) return <LoadingState message="กำลังโหลดค่าสถานะโมเดล..." />;

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

      {/* แสดงค่าตัวชี้วัดของโมเดล - ปรับเป็น Grid 2 คอลัมน์เพื่อให้กระชับ */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="text-gray-500 text-xs">Raw Data</p>
          <p className="font-semibold">{metrics.raw_data.toFixed(0)}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="text-gray-500 text-xs">Train Data</p>
          <p className="font-semibold">{metrics.data_train.toFixed(0)}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="text-gray-500 text-xs">MAE</p>
          <p className="font-semibold text-blue-600">{metrics.MAE.toFixed(4)}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="text-gray-500 text-xs">MSE</p>
          <p className="font-semibold text-red-600">{metrics.MSE.toFixed(4)}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 col-span-2">
          <p className="text-gray-500 text-xs">R² Score</p>
          <p className="font-semibold text-green-600 text-base">{metrics.R2.toFixed(4)}</p>
        </div>
        {/* โชว์ Epochs เฉพาะโมเดลที่เป็น neural network */}
        {(modelType !== "DT" && modelType !== "RF") && (
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 col-span-2">
            <p className="text-gray-500 text-xs">Total Epochs</p>
            <p className="font-semibold">{metrics.epochs?.length || 0}</p>
          </div>
        )}
      </div>
    </div>
  );
}
