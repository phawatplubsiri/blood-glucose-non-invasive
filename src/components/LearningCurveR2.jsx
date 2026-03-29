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

// คอมโพเนนต์สำหรับแสดงกราฟ Learning Curve R2 จากข้อมูลใน Firestore แบบ Real-time
const LearningCurveR2 = ({ collectionName, runId }) => {
  // state สำหรับเก็บข้อมูลกราฟ และ state สำหรับเช็ก error
  const [curveData, setCurveData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Hook สำหรับดึงข้อมูลจาก Firestore แบบ real-time และยกเลิกการเชื่อมต่อเมื่อ component ถูก unmount
  useEffect(() => {
    if (!collectionName || !runId) return;

    const unsub = onSnapshot(doc(db, collectionName, runId), (docSnap) => {
      if (docSnap.exists()) {
        setCurveData(docSnap.data());
        setNotFound(false);
      } else {
        console.error("Document not found in Firestore");
        setNotFound(true);
      }
    });

    return () => unsub(); // Cleanup: ยกเลิก listener
  }, [collectionName, runId]);

  // แสดงผลตามเงื่อนไข: loading หรือ not found
  if (notFound)
    return (
      <div className="text-center text-red-500 mt-4">
        ไม่พบ Document ใน Firestore
      </div>
    );
  if (!curveData) return <div>Loading Graph...</div>;

  // เตรียมข้อมูล (labels, datasets) สำหรับนำไปสร้างกราฟ
  const labels = curveData.train_loss_list.map((_, i) => i + 1);
  const data = {
    labels,
    datasets: [
      {
        label: "Train R2",
        data: curveData.train_R2,
        borderColor: "green",
        tension: 0,
        fill: false,
      },
      {
        label: "Val R2",
        data: curveData.val_R2,
        borderColor: "orange",
        tension: 0,
        fill: false,
      },
    ],
  };

  // ตั้งค่าการแสดงผลต่างๆ ของกราฟ เช่น ชื่อกราฟ, ชื่อแกน
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Learning Curve R2",
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
          // แสดงตัวเลขแกน X ทุกๆ 15 ค่า เพื่อไม่ให้แกนแน่นเกินไป
          callback: function (value) {
            if (value % 15 === 0) return value;
            return "";
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "R2",
          align: "center",
          font: { size: 16, weight: "bold" },
        },
      },
    },
  };

  // Render กราฟเส้น
  return (
    <div className="h-[300px] md:h-[400px] lg:h-[500px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default LearningCurveR2;
