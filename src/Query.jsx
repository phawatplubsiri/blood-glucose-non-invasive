import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfigs";

const MatchedRecords = () => {
  const [matched, setMatched] = useState([]);


  useEffect(() => {
    const fetchMatchedRecords = async () => {
      const bloodRef = collection(db, "BloodRecords");
      const mlRef = collection(db, "MLDataset");

      const bloodSnapshot = await getDocs(bloodRef);
      const mlSnapshot = await getDocs(mlRef);

      const bloodIDs = bloodSnapshot.docs.map((doc) => doc.id);

      const matchedRecords = [];
      mlSnapshot.forEach((doc) => {
        const data = doc.data();
        if (bloodIDs.includes(data.record_id)) {
          matchedRecords.push({
            train_id: doc.id,
            record_id: data.record_id,
          });
        }
      });

      setMatched(matchedRecords);
    };

    fetchMatchedRecords();
  }, [db]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Matched Records</h2>
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Train ID</th>
            <th className="border px-4 py-2">Record ID</th>
          </tr>
        </thead>
        <tbody>
          {matched.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.train_id }{"---"}</td>
              <td className="border px-4 py-2">{item.record_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchedRecords;
