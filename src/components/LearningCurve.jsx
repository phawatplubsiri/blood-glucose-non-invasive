import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebaseConfigs";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ลงทะเบียน components ที่จำเป็นสำหรับ Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// คอมโพเนนต์สำหรับแสดงกราฟ Learning Curve จากข้อมูลใน Firestore แบบ Real-time
const LearningCurve = ({ collectionName, runId }) => {
  // State สำหรับเก็บข้อมูลกราฟ และ state สำหรับเช็กว่าหา document เจอหรือไม่
  const [curveData, setCurveData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Hook สำหรับดึงข้อมูลจาก Firestore แบบ real-time
  useEffect(() => {
    if (!collectionName || !runId) return; // ป้องกันการทำงานถ้ายังไม่มี props

    // onSnapshot: สร้าง real-time listener เพื่อคอยดักฟังการเปลี่ยนแปลงของข้อมูล
    const unsub = onSnapshot(doc(db, collectionName, runId), (docSnap) => {
      if (docSnap.exists()) {
        // ถ้าเจอ document, อัปเดต state
        setCurveData(docSnap.data());
        setNotFound(false);
      } else {
        // ถ้าไม่เจอ, ตั้งค่า state เพื่อแสดงข้อความ error
        console.error("Document not found in Firestore");
        setNotFound(true);
      }
    });

    // Cleanup function: จะถูกเรียกเมื่อ component ถูก unmount เพื่อยกเลิก listener ป้องกัน memory leak
    return () => unsub();
  }, [collectionName, runId]);

  // --- ส่วนของการแสดงผลตามเงื่อนไข (Conditional Rendering) ---
  if (notFound)
    return (
      <div className="text-center text-red-500 mt-4">
        ไม่พบ Document ใน Firestore
      </div>
    );
  if (!curveData) return <div>Loading...</div>; // แสดง "Loading" ขณะรอข้อมูล

  // --- ส่วนของการเตรียมข้อมูลสำหรับ Chart.js ---
  // สร้าง Label แกน X (Epochs) จากความยาวของ array ข้อมูล
  const labels = curveData.train_loss_list.map((_, i) => i + 1);

  // กำหนดข้อมูล (datasets) ที่จะนำไปพล็อตกราฟ
  const data = {
    labels,
    datasets: [
      {
        label: "Train Loss",
        data: curveData.train_loss_list,
        borderColor: "red",
        tension: 0,
        fill: false,
      },
      {
        label: "Val Loss",
        data: curveData.val_loss_list,
        borderColor: "blue",
        tension: 0,
        fill: false,
      },
    ],
  };

  // กำหนดการตั้งค่าและหน้าตาของกราฟ (เช่น ชื่อกราฟ, ชื่อแกน)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Learning Curve Loss",
        align: "center",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Epochs",
          align: "center",
          font: { size: 16, weight: "bold" },
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          // Logic การแสดงผลแกน X: ให้แสดงตัวเลขทุกๆ 15 ค่า เพื่อไม่ให้แกน X แน่นเกินไป
          callback: function (value) {
            if (value % 15 === 0) return value;
            return "";
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Loss",
          align: "center",
          font: { size: 16, weight: "bold" },
        },
      },
    },
  };

  // Render กราฟเส้นโดยส่ง data และ options เข้าไป
  return (
    <div className="h-[300px] md:h-[400px] lg:h-[500px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default LearningCurve;
