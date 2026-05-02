import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebaseConfigs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { LoadingState, NotFoundState } from "./StatusMessage";

// ลงทะเบียน component ที่ chart.js ต้องใช้
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FeatureImportanceChart = ({ collectionName, runId }) => {
  const [chartData, setChartData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!collectionName || !runId) return;

    // ดึงข้อมูลแบบเรียลไทม์จาก Firestore
    const unsub = onSnapshot(doc(db, collectionName, runId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        // ถ้าไม่มี field feature_importances ให้แจ้ง error
        if (!data.feature_importances) {
          console.error("ไม่พบฟิลด์ feature_importances ใน document นี้");
          setNotFound(true);
          return;
        }

        const importances = data.feature_importances;

        // เอาชื่อ feature (ตัดคำในวงเล็บออก)
        const labels = importances.map((item) =>
          item.feature.split(" ")[0].replace(/['"]+/g, "")
        );

        // ค่าความสำคัญของแต่ละ feature
        const values = importances.map((item) => item.importance);

        // เซ็ตข้อมูลให้ chart
        setChartData({
          labels,
          datasets: [
            {
              label: "Importance (Sum Score)",
              data: values,
              backgroundColor: "rgba(54, 118, 235, 127)",
              borderColor: "rgba(54, 87, 235, 1)",
              borderWidth: 1,
            },
          ],
        });
        setNotFound(false);
      } else {
        // ถ้าไม่เจอ document ใน Firestore
        console.error("Document not found in Firestore");
        setNotFound(true);
      }
    });

    return () => unsub(); // ปิด listener ตอนออกจากหน้า
  }, [collectionName, runId]);

  // ถ้าไม่เจอ document
  if (notFound)
    return (
      <NotFoundState 
        message="ไม่พบข้อมูล Feature Importance" 
      />
    );

  // ยังโหลดข้อมูลไม่เสร็จ
  if (!chartData) return <LoadingState message="กำลังโหลดข้อมูลความสำคัญของฟีเจอร์..." />;

  // ตั้งค่าการแสดงผลของกราฟ
  const options = {
    indexAxis: "y", // หมุนแกนเป็นแนวนอน
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      title: {
        display: true,
        text: "Feature Importance for Glucose Meter Prediction",
        align: "center",
        font: { size: 16, weight: "bold" },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Importance (Sum Score)",
          align: "center",
          font: { size: 14, weight: "bold" },
        },
        grid: { color: "#eee" },
      },
      y: {
        title: {
          display: true,
          text: "Feature",
          align: "center",
          font: { size: 14, weight: "bold" },
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-[300px] md:h-[400px] lg:h-[500px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default FeatureImportanceChart;
