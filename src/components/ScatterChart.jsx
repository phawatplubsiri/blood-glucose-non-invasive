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

// คอมโพเนนต์สำหรับแสดงกราฟ Scatter เปรียบเทียบค่าจริง (Actual) และค่าที่ทำนาย (Predicted)
const ScatterChart = ({ collectionName, runId }) => {
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

  // --- ส่วนของการเตรียมข้อมูลสำหรับกราฟ ---

  // 1. สร้างชุดข้อมูลสำหรับจุด Scatter
  const points = chartData.y_true.map((y, i) => ({
    x: y,                      // แกน X คือค่าจริง (Actual)
    y: chartData.y_pred[i],    // แกน Y คือค่าที่ทำนาย (Predicted)
  }));

  // 2. สร้างข้อมูลสำหรับเส้นอ้างอิง y = x (เส้นที่ค่าจริงเท่ากับค่าที่ทำนายพอดี)
  // เพื่อใช้เป็นเกณฑ์วัดว่าโมเดลทำนายได้แม่นยำแค่ไหน
  const minVal = Math.min(...chartData.y_true, ...chartData.y_pred);
  const maxVal = Math.max(...chartData.y_true, ...chartData.y_pred);
  const perfectFitLine = [
    { x: minVal, y: minVal },
    { x: maxVal, y: maxVal },
  ];

  // กำหนดข้อมูลที่จะนำไปพล็อตในกราฟ
  const data = {
    datasets: [
      // Dataset 1: จุดข้อมูลที่เปรียบเทียบค่าจริงกับค่าที่ทำนาย
      {
        label: "Data points",
        data: points,
        borderColor: "#3e749e",
        backgroundColor: "#97add1",
        borderWidth: 1.5,
        pointRadius: 4,
      },
      // Dataset 2: เส้นอ้างอิงสีแดง (y = x)
      {
        label: "Perfect Fit (y = x)",
        data: perfectFitLine,
        borderColor: "red",
        borderWidth: 1.5,
        fill: false,
        showLine: true,   // กำหนดให้แสดงเป็นเส้น
        pointRadius: 0,   // ไม่ต้องแสดงจุดบนเส้น
      },
    ],
  };

  // ตั้งค่าการแสดงผลต่างๆ ของกราฟ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Actual vs Predicted Glucose (Scatter)", font: { size: 16, weight: "bold" } },
    },
    scales: {
      x: { title: { display: true, text: "Actual Glucose Value", font: { size: 14, weight: "bold" } } },
      y: { title: { display: true, text: "Predicted Glucose Value", font: { size: 14, weight: "bold" } } },
    },
  };

  // Render กราฟแบบ Scatter
  return (
    <div className="h-[300px] md:h-[400px] lg:h-[500px]">
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ScatterChart;