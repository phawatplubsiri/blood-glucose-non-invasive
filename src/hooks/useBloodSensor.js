import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { realDb } from "../configs/firebaseConfigs";

// Custom Hook สำหรับดึงข้อมูลจาก Sensor (ESP32) แบบ real-time จาก Realtime Database
function useBloodSensor() {
  // state สำหรับเก็บค่าต่างๆ ที่ได้รับจาก sensor
  const [device_id, setDevice] = useState("");
  const [voltage, setVoltage] = useState("");
  const [currents, setCurrent] = useState("");
  const [analog_value, setAnalog] = useState("");

  useEffect(() => {
    const bloodRef = ref(realDb, "Blood");

    // สร้าง real-time listener เพื่อรอรับข้อมูลอัปเดตจาก Firebase
    const unsub = onValue(bloodRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return; // ถ้าไม่มีข้อมูล ให้หยุดทำงาน

      // แปลง object ที่ได้มาเป็น array และดึง key-value คู่แรกออกมา
      // คาดว่าข้อมูลมีโครงสร้างเป็น { "device_id": { ...values } }
      const [mac, values] = Object.entries(data)[0] || [];

      // ถ้าดึงข้อมูลสำเร็จ ให้อัปเดต state ทั้งหมด
      if (mac && values) {
        setDevice(mac);
        setVoltage(values.voltage || "");
        setCurrent(values.currents || "");
        setAnalog(values.analog_value || "");
      }
    });

    // Cleanup function: ยกเลิก listener เมื่อ component ที่ใช้ hook นี้ถูกทำลาย
    return () => unsub();
  }, []);

  // return ค่า state ทั้งหมดเพื่อให้ component ที่เรียกใช้ hook นี้สามารถนำไปใช้ได้
  return { device_id, voltage, currents, analog_value };
}

export default useBloodSensor;
