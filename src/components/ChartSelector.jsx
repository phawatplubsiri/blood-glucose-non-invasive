// คอมโพเนนต์สำหรับสร้าง Dropdown เพื่อเลือกประเภทของกราฟ
function ChartSelector({ selectedChart, onChange, modelType }) {
  return (
    <div className="mb-4 text-center">
      <label className="mr-2 font-medium">เลือกกราฟ:</label>
      <select
        // รับค่า state ที่ถูกเลือกมาแสดงผลใน dropdown
        value={selectedChart}
        // เมื่อผู้ใช้เลือกค่าใหม่ จะเรียกฟังก์ชัน onChange ที่ส่งมาจาก parent component
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-gray-600 bg-white px-2 py-1 text-sm"
      >
        <option value="all">All</option>

        {/* แสดงตัวเลือก Learning Curve Loss เฉพาะเมื่อ modelType เป็น "DNN, CNN, MLR" เท่านั้น */}
        {modelType !== "DT" && modelType !== "RF" && (
          <option value="learningCurve">Learning Curve Loss</option>
        )}

        {/* แสดงตัวเลือก Learning Curve R2 เฉพาะเมื่อ modelType เป็น "DNN" เท่านั้น */}
        {(modelType === "DNN" || modelType === "CNN") && (
          <option value="learningCurveR2">Learning Curve R2</option>
        )}

        {/* แสดงตัวเลือก Feature Importance เฉพาะเมื่อ modelType เป็น "DT, RF" เท่านั้น */}
        {(modelType === "DT" || modelType === "RF") && (
          <option value="featureImportance">Feature Importance</option>
        )}

        <option value="lineChart">Line Chart</option>
        <option value="scatterChart">Scatter Chart</option>
        <option value="residualChart">Residual Chart</option>
      </select>
    </div>
  );
}

export default ChartSelector;
