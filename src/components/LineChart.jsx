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

// คอมโพเนนต์สำหรับแสดงกราฟเส้นเปรียบเทียบค่าจริง (Actual) และค่าที่ทำนาย (Predicted)
const LineChart = ({ collectionName, runId }) => {
  // state สำหรับเก็บข้อมูลกราฟ และ state สำหรับเช็ก error
  const [chartData, setChartData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Hook สำหรับดึงข้อมูลจาก Firestore แบบ real-time
  useEffect(() => {
    if (!collectionName || !runId) return;
    const unsub = onSnapshot(doc(db, collectionName, runId), (snap) => {
      if (snap.exists()) {
        setChartData(snap.data());
        setNotFound(false);
      } else setNotFound(true);
    });
    // Cleanup: ยกเลิก listener เมื่อ component ถูก unmount
    return () => unsub();
  }, [collectionName, runId]);

  // แสดงผลตามเงื่อนไข: loading หรือ not found
  if (notFound) return <div className="text-red-500">ไม่พบข้อมูล</div>;
  if (!chartData) return <div>Loading...</div>;

  // เตรียมข้อมูล (labels, datasets) สำหรับนำไปสร้างกราฟ
  const labels = chartData.y_true.map((_, i) => i + 1);
  const data = {
    labels,
    datasets: [
      {
        label: "Actual",
        data: chartData.y_true,
        borderColor: "#3e749e",
        tension: 0,
      },
      {
        label: "Predicted",
        data: chartData.y_pred,
        borderColor: "orange",
        tension: 0,
      },
    ],
  };

  // ตั้งค่าการแสดงผลต่างๆ ของกราฟ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Actual vs Predicted Glucose (Line)",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Sample",
          font: { size: 16, weight: "bold" },
        },
      },
      y: {
        title: {
          display: true,
          text: "Glucose Value",
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

export default LineChart;
