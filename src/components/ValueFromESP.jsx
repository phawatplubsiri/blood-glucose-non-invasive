import { useState, useEffect, useRef } from "react";
import { realDb } from "../configs/firebaseConfigs";
import { ref, onValue } from "firebase/database";
import Swal from "sweetalert2";

function SensorData() {
  const [Blood, setBlood] = useState([]);
  const prevData = useRef(null); // เก็บค่าครั้งก่อนหน้า
  const firstLoad = useRef(true); // ป้องกันไม่ให้แจ้งเตือนตอนเปิดหน้าแรก

  useEffect(() => {
    const bloodRef = ref(realDb, "Blood");

    const unsubscribe = onValue(
      bloodRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const bloodArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );

          const newData = bloodArray[0]; // ปกติจะมี object เดียว
          const oldData = prevData.current;

          // ถ้าไม่ใช่การโหลดครั้งแรก ให้เช็กว่าค่าไหนเปลี่ยน
          if (!firstLoad.current && oldData) {
            const changedKeys = Object.keys(newData).filter(
              (key) => newData[key] !== oldData[key]
            );

            changedKeys.forEach((key) => {
              if (key !== "id") {
                Swal.fire({
                  toast: true,
                  position: "top-end",
                  title: `${key} อัปเดตเป็น ${newData[key]}`,
                  icon: "success",
                  iconColor: "green",
                  background: "#f7d9d9",
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            });
          }

          prevData.current = newData;
          setBlood(bloodArray);
          firstLoad.current = false;
        } else {
          setBlood([]);
        }
      },
      (error) => {
        console.error("Firebase Error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const bars = [
    { label: "Analog", key: "analog_value", max: 4096 },
    { label: "Currents", key: "currents", max: 0.033 },
    { label: "Voltage", key: "voltage", max: 3.3 },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {Blood.map((bloods) => (
        <div key={bloods.id} className="p-4">
          {bars.map(({ label, key, max }) => (
            <div key={key} className="mb-4">
              <span className="block">
                {label}: {bloods[key]}
              </span>
              <div className="sm:w-[300px] w-[200px] h-5 bg-white border-2 border-black rounded-full overflow-hidden ">
                <div
                  className="h-full bg-[#f48b9a] transition-all duration-500 ease-in-out"
                  style={{
                    // การที่ใส่ ,100 เพื่อกันไม่ให้เกิน 100%
                    width: `${Math.min((bloods[key] / max) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default SensorData;
