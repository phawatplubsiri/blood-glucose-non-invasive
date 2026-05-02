import { useState } from "react";
import LearningCurve from "../components/LearningCurve";
import ModelEvalutionMetric from "../components/ModelEvalutionMetric";
import LineChart from "../components/LineChart";
import ScatterChart from "../components/ScatterChart";
import ResidualChart from "../components/ResidualChart";
import RunSelector from "../components/RunSelector";
import ColabDriveLinks from "../components/ColabDriveLink";
import ChartSelector from "../components/ChartSelector";
import LearningCurveR2 from "../components/LearningCurveR2";
import ControlPanel from "../components/ControlPanel";
import { Settings } from "lucide-react";

export default function DNNPage() {
  // ชื่อ collection ใน Firestore (กำหนดค่าตายตัวสำหรับหน้านี้)
  const selectedModel = "training_results_DNN";
  // state สำหรับเก็บ 'run' ที่ผู้ใช้เลือก
  const [selectedRun, setSelectedRun] = useState("run001");
  // state สำหรับเก็บ 'chart' ที่ผู้ใช้เลือก
  const [selectedChart, setSelectedChart] = useState("all");
  // state สำหรับเปิด/ปิดแผงควบคุม
  const [isControlOpen, setIsControlOpen] = useState(true);

  return (
    <div className="flex flex-col px-2 md:px-8 font-mitr w-full max-w-full overflow-x-hidden">
      <div className="flex justify-center">
        <p className="mt-4 md:mt-6 mb-2 p-2 md:p-3 text-center text-lg md:text-xl bg-[#f3d7d7] rounded-2xl border border-pink-200 shadow-sm">
          Deep Neural Network
        </p>
      </div>

      {/* Layout หลักของหน้า: แบ่งเป็นส่วนแสดงกราฟ และส่วนควบคุม */}
      <div className="my-1 flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center">

        {/* === ส่วนแสดงกราฟ (ฝั่งซ้าย) === */}
        <div className={`transition-all duration-300 bg-white p-3 shadow-md border rounded-xl space-y-4 ${
          selectedChart === "all" ? "h-auto lg:h-[750px] overflow-y-auto" : "h-auto"
        } ${isControlOpen ? "w-full lg:max-w-[850px]" : "w-full lg:max-w-[1100px]"}`}>
          {/* Conditional Rendering: 
            แสดงกราฟตามค่าที่ถูกเลือกใน `selectedChart` 
            ซึ่งหน้านี้จะมีกราฟ LearningCurveR2 เพิ่มเข้ามาเป็นพิเศษ
          */}
          {selectedChart === "learningCurve" && ( <LearningCurve collectionName={selectedModel} runId={selectedRun} /> )}
          {selectedChart === "learningCurveR2" && ( <LearningCurveR2 collectionName={selectedModel} runId={selectedRun} /> )}
          {selectedChart === "lineChart" && ( <LineChart collectionName={selectedModel} runId={selectedRun} /> )}
          {selectedChart === "scatterChart" && ( <ScatterChart collectionName={selectedModel} runId={selectedRun} /> )}
          {selectedChart === "residualChart" && ( <ResidualChart collectionName={selectedModel} runId={selectedRun} /> )}

          {/* กรณีที่เลือก "all" จะแสดงกราฟทั้งหมดรวมถึง R2 ด้วย */}
          {selectedChart === "all" && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 border rounded-3xl p-2"><LearningCurve collectionName={selectedModel} runId={selectedRun} /></div>
              <div className="bg-gray-50 border rounded-3xl p-2"><LearningCurveR2 collectionName={selectedModel} runId={selectedRun} /></div>
              <div className="bg-gray-50 border rounded-3xl p-2"><LineChart collectionName={selectedModel} runId={selectedRun} /></div>
              <div className="bg-gray-50 border rounded-3xl p-2"><ScatterChart collectionName={selectedModel} runId={selectedRun} /></div>
              <div className="bg-gray-50 border rounded-3xl p-2"><ResidualChart collectionName={selectedModel} runId={selectedRun} /></div>
            </div>
          )}
        </div>

        {/* ส่วนควบคุมและแสดงข้อมูล (ลิ้นชักฝั่งขวา) */}
        <ControlPanel isOpen={isControlOpen} setIsOpen={setIsControlOpen}>
          {/* กลุ่มที่ 1: การเลือกข้อมูลและกราฟ */}
          <div className="space-y-4">
            <RunSelector
              selectedModel={selectedModel}
              selectedRun={selectedRun}
              setSelectedRun={setSelectedRun}
            />
            <ChartSelector
              selectedChart={selectedChart}
              onChange={(chart) => setSelectedChart(chart)}
              modelType="DNN"
            />
          </div>

          {/* กลุ่มที่ 2: สถานะโมเดล */}
          <div className="bg-gray-50/50 rounded-xl p-1 border border-gray-100">
            <ModelEvalutionMetric
              collectionName={selectedModel}
              runId={selectedRun}
              modelType="DNN"
            />
          </div>

          {/* กลุ่มที่ 3: ลิงก์เชื่อมโยง */}
          <div className="pt-2">
            <ColabDriveLinks
              colabLink = {import.meta.env.VITE_COLAB_DNN}
              driveLink = {import.meta.env.VITE_DRIVE_DNN}
            />
          </div>
        </ControlPanel>
      </div>
    </div>
  );
}