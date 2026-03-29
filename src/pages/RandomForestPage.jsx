import { useState } from "react";
import ModelEvalutionMetric from "../components/ModelEvalutionMetric";
import LineChart from "../components/LineChart";
import ScatterChart from "../components/ScatterChart";
import ResidualChart from "../components/ResidualChart";
import RunSelector from "../components/RunSelector";
import ColabDriveLinks from "../components/ColabDriveLink";
import ChartSelector from "../components/ChartSelector";
import FeatureImportance from "../components/FeatureImportanceChart";

export default function RandomForestPage() {
  // ชื่อ collection ใน Firestore (กำหนดค่าตายตัวสำหรับหน้านี้โดยเฉพาะ)
  const selectedModel = "training_results_RandomForest";
  // state สำหรับเก็บ 'run' ที่ผู้ใช้เลือกจาก Dropdown
  const [selectedRun, setSelectedRun] = useState("run001");
  // state สำหรับเก็บ 'chart' ที่ผู้ใช้เลือก เพื่อกรองการแสดงผล
  const [selectedChart, setSelectedChart] = useState("all");

  return (
    <div className="flex flex-col px-2 md:px-8 font-mitr">
      <div className="flex justify-center">
        <p className="mt-6 md:mt-12 mb-4 p-3 md:p-4 text-center text-xl md:text-2xl bg-[#f3d7d7] rounded-2xl">
          Random Forest
        </p>
      </div>

      {/* Layout หลักของหน้า: แบ่งเป็นส่วนแสดงกราฟ และส่วนควบคุม */}
      <div className="my-3 flex flex-col items-center gap-6 lg:flex-row lg:gap-10 lg:justify-center">
        {/* ส่วนแสดงกราฟ (ฝั่งซ้าย) */}
        <div className={`w-full max-w-[900px] bg-white p-4 shadow-sm border rounded-xl space-y-6 ${
          selectedChart === "all" ? "h-auto lg:h-[700px] overflow-y-auto" : "h-auto"
        }`}>
          {/* Conditional Rendering: ใช้ค่าจาก state `selectedChart` เพื่อเลือกว่าจะแสดงกราฟตัวไหน */}
          {selectedChart === "featureImportance" && (
            <FeatureImportance
              collectionName={selectedModel}
              runId={selectedRun}
            />
          )}
          {selectedChart === "lineChart" && (
            <LineChart collectionName={selectedModel} runId={selectedRun} />
          )}
          {selectedChart === "scatterChart" && (
            <ScatterChart collectionName={selectedModel} runId={selectedRun} />
          )}
          {selectedChart === "residualChart" && (
            <ResidualChart collectionName={selectedModel} runId={selectedRun} />
          )}

          {/* กรณีที่เลือก "all" จะแสดงกราฟทั้งหมด */}
          {selectedChart === "all" && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 border rounded-3xl p-2">
                <FeatureImportance
                  collectionName={selectedModel}
                  runId={selectedRun}
                />
              </div>
              <div className="bg-gray-50 border rounded-3xl p-2">
                <LineChart collectionName={selectedModel} runId={selectedRun} />
              </div>
              <div className="bg-gray-50 border rounded-3xl p-2">
                <ScatterChart
                  collectionName={selectedModel}
                  runId={selectedRun}
                />
              </div>
              <div className="bg-gray-50 border rounded-3xl p-2">
                <ResidualChart
                  collectionName={selectedModel}
                  runId={selectedRun}
                />
              </div>
            </div>
          )}
        </div>

        {/* ส่วนควบคุมและแสดงข้อมูล (ฝั่งขวา) */}
        <div className="flex flex-col items-center justify-center gap-5 w-full lg:w-auto">
          <div className="gap-3">
            {/* Component สำหรับเลือก Run ID */}
            <RunSelector
              selectedModel={selectedModel}
              selectedRun={selectedRun}
              setSelectedRun={setSelectedRun}
            />

            {/* Component สำหรับเลือกประเภทกราฟ */}
            <div className="mb-4 text-center ">
              <ChartSelector
                selectedChart={selectedChart}
                onChange={(chart) => setSelectedChart(chart)}
                modelType="RF"
              />
            </div>
          </div>

          {/* Component สำหรับแสดงค่า Metrics ของโมเดล */}
          <div className="h-full w-full max-w-[200px] bg-white p-4">
            <ModelEvalutionMetric
              collectionName={selectedModel}
              runId={selectedRun}
              modelType="RF"
            />
          </div>

          {/* Component สำหรับแสดงลิงก์ Colab และ Drive */}
          <ColabDriveLinks
            colabLink = {import.meta.env.VITE_COLAB_RF}
            driveLink = {import.meta.env.VITE_DRIVE_RF}
          />
        </div>
      </div>
    </div>
  );
}
