import { useState } from "react";

export const initialFormData = {
  glucose_meter: "",
  heart_rate: "",
  systolic: "",
  diastolic: "",
  age: "",
  gender: "male",
  weight: "",
  height: "",
};

function useFormData() {
  // state หลักที่เก็บข้อมูลทั้งหมดของฟอร์ม
  const [formData, setFormData] = useState(initialFormData);
  // อนุญาตให้เป็นค่าว่าง, ตัวเลข, หรือตัวเลขทศนิยมได้
  const isNumeric = (value) => /^(\d+\.?\d*|\.\d*)?$/.test(value);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงค่าใน input fields ทั้งหมด
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // อัปเดต state แบบมีเงื่อนไข เพื่อป้องกันการกรอกข้อมูลที่ไม่ใช่ตัวเลขในช่องที่กำหนด
    setFormData((prevData) =>
      // เงื่อนไข: ถ้า input field เป็น field ที่ต้องเป็นตัวเลข แต่ค่าที่กรอกเข้ามา "ไม่ใช่" ตัวเลข
      ["glucose_meter", "heart_rate", "systolic", "diastolic", "age", "weight", "height"].includes(name) && !isNumeric(value)
        ? prevData 
        : { ...prevData, [name]: value } 
    );
  };

  const resetForm = (resetTestMode) => {
    setFormData(initialFormData);
    // มี optional callback สำหรับ reset state อื่นๆ ใน component ที่เรียกใช้ (ถ้ามี)
    if (typeof resetTestMode === 'function') {
      resetTestMode(false);
    }
  };

  // return state และฟังก์ชันต่างๆ ออกไปให้ component อื่นเรียกใช้
  return {
    formData,
    handleChange,
    resetForm,
  };
}

export default useFormData;