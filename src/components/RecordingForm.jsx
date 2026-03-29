import { getRecord, toFloat } from "../utils/formatUtils";
import { getNextTrainId } from "../utils/firestoreUtils";
import Swal from "sweetalert2";
import { db } from "../configs/firebaseConfigs";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import useBloodSensor from "../hooks/useBloodSensor";
import useFormData from "../hooks/useFormData";

// คอมโพเนนต์ฟอร์มสำหรับกรอกและบันทึกข้อมูลการตรวจวัดทั้งหมด
function RecordingForm() {
  // ดึงข้อมูล real-time จาก Sensor
  const { device_id, voltage, currents, analog_value } = useBloodSensor();
  // จัดการ state และ logic ของฟอร์ม (เช่น การเปลี่ยนแปลงค่า, การล้างฟอร์ม)
  const { formData, handleChange, resetForm } = useFormData();
  
  // ฟังก์ชันสำหรับกำหนดข้อความแจ้งเตือนเมื่อกรอกข้อมูลไม่ถูกต้อง
  const handleInvalid = (message) => (e) => {
    e.target.setCustomValidity(message);
  };
  // ฟังก์ชันสำหรับล้างข้อความแจ้งเตือนเมื่อผู้ใช้เริ่มกรอกข้อมูล
  const clearValidity = (e) => {
    e.target.setCustomValidity("");
  };

  // ฟังก์ชันหลักที่จะทำงานเมื่อผู้ใช้กด "บันทึกข้อมูล"
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      glucose_meter,
      heart_rate,
      systolic,
      diastolic,
      age,
      gender,
      weight,
      height,
    } = formData;

    const dataSummary = `
    ค่า Glucose จาก Meter : ${glucose_meter}<br>
    อัตราการเต้นของหัวใจ : ${heart_rate}<br>
    ค่าความดันบน : ${systolic}<br>
    ค่าความดันล่าง : ${diastolic}<br>
    อายุ : ${age}<br>
    เพศ : ${gender}<br>
    น้ำหนัก : ${weight}<br>
    ส่วนสูง : ${height}
  `;

    const result = await Swal.fire({
      title: "ยืนยันการบันทึกข้อมูล?",
      html: dataSummary,
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      background: "#f7d9d9",
      cancelButtonColor: "#999",
      confirmButtonColor: "#f48b9a",
      customClass: {
        title: "font-mitr",
        popup: "font-mitr",
        confirmButton: "font-mitr",
        cancelButton: "font-mitr",
        htmlContainer: "font-mitr",
      },
    });

    if (!result.isConfirmed) return;

    // เตรียมข้อมูลสำหรับบันทึกลง Firestore
    const { record_id, record_day, record_time } = getRecord();

    const parsedFormData = {
      glucose_meter: toFloat(glucose_meter),
      heart_rate: toFloat(heart_rate),
      systolic: toFloat(systolic),
      diastolic: toFloat(diastolic),
      age: +age,
      gender,
      weight: toFloat(weight),
      height: toFloat(height),
    };

    // บันทึกข้อมูลลง Firestore พร้อมส่วนจัดการ Error 
    try {
      //บันทึก BloodRecord
      await setDoc(doc(db, "BloodRecords", record_id), {
        ...parsedFormData,
        record_day,
        record_time,
        device_id,
      });

      const train_id = await getNextTrainId();

      //บันทึก MLDataset
      await setDoc(doc(db, "MLDataset", train_id), {
        ...parsedFormData,
        record_id,
        voltage,
        analog_value,
        currents,
      });

      //แสดง success
      await Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ!",
        text: `ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว`,
        icon: "success",
        iconColor: "green",
        background: "#f7d9d9",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#f48b9a",
        customClass: {
          title: "font-mitr",
          confirmButton: "font-mitr",
          htmlContainer: "font-mitr",
        },
      });

      resetForm();
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);

      //ถ้ามี error ลบข้อมูล BloodRecords ที่บันทึกไป
      try {
        await deleteDoc(doc(db, "BloodRecords", record_id));
      } catch (deleteErr) {
        console.error("ลบ BloodRecords ไม่สำเร็จ:", deleteErr);
      }

      await Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่",
        icon: "error",
        background: "#f7d9d9",
      });
    }
  };

  const inputClass =
    "h-[45px] w-full outline-none text-[16px] rounded-full px-4 bg-white border-3 border-gray-300 text-black focus:border-[#f48b9a] transition-all duration-350";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap justify-between gap-y-4 md:gap-y-6 my-5"
    >
      {[
        {
          name: "glucose_meter",
          label: "ค่า Glucose จาก Meter (mg/dL)",
          placeholder: "กรอกค่า Glucose",
        },
        {
          name: "heart_rate",
          label: "อัตราการเต้นของหัวใจ (bpm)",
          placeholder: "กรอกค่า Heart Rate",
        },
        {
          name: "systolic",
          label: "ค่าความดันบน (mmHg)",
          placeholder: "กรอกค่าความดันบน",
        },
        {
          name: "diastolic",
          label: "ค่าความดันล่าง (mmHg)",
          placeholder: "กรอกค่าความดันล่าง",
        },
        { name: "weight", label: "น้ำหนัก (kg)", placeholder: "กรอกน้ำหนัก" },
        { name: "height", label: "ส่วนสูง (cm)", placeholder: "กรอกส่วนสูง" },
        { name: "age", label: "อายุ (ปี)", placeholder: "กรอกอายุ" },
      ].map((field) => (
        <div key={field.name} className="w-full sm:w-[calc(50%-12px)]">
          <label className=" block mb-1 text-sm md:text-base">{field.label}</label>
          <input
            type="text"
            name={field.name}
            value={formData[field.name]}
            placeholder={field.placeholder}
            onChange={handleChange}
            onInvalid={handleInvalid("กรุณากรอกข้อมูลให้ครบถ้วน")}
            onInput={clearValidity}
            autoComplete="off"
            required
            className={inputClass}
          />
        </div>
      ))}

      <div className="w-full sm:w-[calc(50%-12px)]">
        <label className="block mb-1 text-sm md:text-base">เพศ</label>
        <div
          className="flex gap-5 mt-4"
          role="radiogroup"
          >
          {[
            { value: "male", label: "ชาย" },
            { value: "female", label: "หญิง" },
          ].map((opt) => (
            <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer text-[16px]"
            >
              <input
                type="radio"
                name="gender"
                value={opt.value}
                onInvalid={handleInvalid("กรุณาเลือกเพศ")}
                checked={formData.gender === opt.value}
                onChange={(e) => {
                  clearValidity(e);
                  handleChange(e);
                }}
                className="sr-only"
              />
              <span
                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-250 ${
                  formData.gender === opt.value
                    ? "border-[#f48b9a]"
                    : "border-black"
                }`}
              >
                <span
                  className={`w-[10px] h-[10px] rounded-full transition-all duration-250 ${
                    formData.gender === opt.value
                      ? "bg-[#f48b9a]"
                      : "bg-transparent"
                  }`}
                />
              </span>
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full max-w-md mx-auto mt-7 ">
        <button
          type="button"
          onClick={resetForm}
          className="w-full md:w-auto text-white text-[18px] px-7 py-3 rounded-full border-2 border-black transition-all bg-gradient-to-br from-[#7b8085] to-[#bab6bc] hover:bg-gradient-to-tl cursor-pointer"
        >
          ล้างค่า
        </button>
        <button
          type="submit"
          className="w-full md:w-auto text-black text-[18px]  px-7 py-3 rounded-full border-2 border-black transition-all bg-gradient-to-br from-[#f7d9d9] to-[#f48b9a] hover:bg-gradient-to-tl cursor-pointer"
        >
          บันทึกข้อมูล
        </button>
      </div>
    </form>
  );
}

export default RecordingForm;
