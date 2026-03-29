import { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebaseConfigs";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  PointElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend
);

// คอมโพเนนต์สำหรับแสดงกราฟ Residual Plot เพื่อประเมิน Error ของโมเดล
const ResidualChart = ({ collectionName, runId }) => {
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
    // Cleanup: ยกเลิก listener
    return () => unsub();
  }, [collectionName, runId]);

  // แสดงผลตามเงื่อนไข: loading หรือ not found
  if (notFound) return <div className="text-red-500">ไม่พบข้อมูล</div>;
  if (!chartData) return <div>Loading...</div>;

  // --- ส่วนของการเตรียมข้อมูลสำหรับกราฟ ---

  // 1. คำนวณค่า Residuals (ค่าความคลาดเคลื่อน)
  const points = chartData.y_true.map((y, i) => ({
    x: chartData.y_pred[i],                        // แกน X คือค่าที่โมเดลทำนาย (Predicted)
    y: chartData.y_true[i] - chartData.y_pred[i],  // แกน Y คือค่า Residual (Actual - Predicted)
  }));

  // 2. สร้างข้อมูลสำหรับเส้นอ้างอิงที่ Y = 0 (เส้นที่ไม่มีความคลาดเคลื่อนเลย)
  const minX = Math.min(...chartData.y_pred);
  const maxX = Math.max(...chartData.y_true);
  const zeroLine = [
    { x: minX, y: 0 },
    { x: maxX, y: 0 },
  ];

  // กำหนดข้อมูลที่จะนำไปพล็อตในกราฟ
  const data = {
    datasets: [
      // Dataset 1: จุด Scatter ของค่า Residuals
      {
        label: "Residuals",
        data: points,
        borderColor: "#3e749e",
        backgroundColor: "#97add1",
        borderWidth: 1.5,
        pointRadius: 4,
      },
      // Dataset 2: เส้นอ้างอิงสีแดงที่ Y = 0
      {
        label: "Zero Residual Line",
        data: zeroLine,
        borderColor: "red",
        borderWidth: 1.5,
        fill: false,
        showLine: true,    // กำหนดให้แสดงเป็นเส้น
        pointRadius: 0,    // ไม่ต้องแสดงจุดบนเส้น
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
        text: "Residuals Plot",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      x: { title: { display: true, text: "Predicted glucose_meter", font: { size: 14, weight: "bold" } } },
      y: { title: { display: true, text: "Residuals", font: { size: 14, weight: "bold" } } },
    },
  };

  // Render กราฟแบบ Scatter
  return (
    <div className="h-[300px] md:h-[400px] lg:h-[500px]">
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ResidualChart;