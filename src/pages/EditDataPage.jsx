import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../configs/firebaseConfigs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { fields, editableFields } from "../constants/fields";
import EditTableRow from "../components/EditTableRow";
import ExportCSVButton from "../components/ExportCSVButton";

import { LoadingState, NotFoundState } from "../components/StatusMessage";

function EditDataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "BloodRecords"));
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData(fields.reduce((acc, f) => ({ ...acc, [f.key]: item[f.key] || "" }), {}));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editableFields.includes(name) && name !== "gender" && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // สร้าง Toast instance
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    background: "#f7d9d9",
    iconColor: '#f48b9a',
    customClass: { title: 'font-mitr' },
  });

  const handleUpdate = async (id) => {
    const missingFields = editableFields.filter(
      (key) => !formData[key] && formData[key] !== 0
    );

    if (missingFields.length > 0) {
      const missingLabels = missingFields
        .map((key) => fields.find((f) => f.key === key)?.label || key)
        .join(", ");
      
      return Toast.fire({
        icon: 'warning',
        title: `กรุณากรอกข้อมูลให้ครบ: ${missingLabels}`,
      });
    }

    // ยืนยันก่อนอัปเดต
    const confirm = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      background: "#f7d9d9",
      confirmButtonColor: "#f48b9a",
      customClass: { title: "font-mitr", confirmButton: "font-mitr", cancelButton: "font-mitr" },
    });

    if (confirm.isConfirmed) {
      try {
        await updateDoc(doc(db, "BloodRecords", id), formData);

        const q = query(collection(db, "MLDataset"), where("record_id", "==", id));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) await updateDoc(doc(db, "MLDataset", snapshot.docs[0].id), formData);

        Toast.fire({ icon: 'success', iconColor: 'green', title: 'อัปเดตข้อมูลสำเร็จ!' });
        setEditingId(null);
        fetchData();
      } catch (error) {
        console.error(error);
        Toast.fire({ icon: 'error', title: 'ไม่สามารถอัปเดตข้อมูลได้' });
      }
    }
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="px-4 md:px-8 py-5 font-mitr">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 relative">
        <button
          onClick={() => navigate("/")}
          className="w-fit bg-[#f48b9a] hover:bg-pink-200 text-white hover:text-black border border-black py-2 px-4 rounded cursor-pointer transition-colors"
        >
          ← กลับหน้าหลัก
        </button>
        
        <h1 className="text-xl md:text-2xl text-center md:absolute md:left-1/2 md:-translate-x-1/2 w-full md:w-auto font-semibold">
          แก้ไขข้อมูล
        </h1>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#f48b9a] hover:bg-pink-200 rounded disabled:opacity-50 cursor-pointer"
          >
            ←
          </button>
          <span className="whitespace-nowrap">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#f48b9a] hover:bg-pink-200 rounded disabled:opacity-50 cursor-pointer"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-auto max-h-[60vh] md:max-h-[580px] border border-black rounded-lg shadow-sm">
        <table className="w-full text-left border border-collapse bg-white">
          <thead className="sticky top-0 z-10">
            <tr className="bg-pink-100">
              <th className="border border-black p-2 text-center">ลำดับ</th>
              {fields.map((field) => (
                <th key={field.key} className="border border-black p-2 text-center">{field.label}</th>
              ))}
              <th className="border border-black p-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={fields.length + 2} className="p-10">
                  <LoadingState message="กำลังดึงข้อมูลรายการ..." />
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <EditTableRow
                  key={item.id}
                  item={item}
                  index={startIndex + index + 1}
                  editingId={editingId}
                  formData={formData}
                  fields={fields}
                  onEditClick={handleEditClick}
                  onCancel={() => setEditingId(null)}
                  onChange={handleChange}
                  onUpdate={handleUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan={fields.length + 2} className="p-10">
                  <NotFoundState message="ไม่พบข้อมูลรายการ" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col w-35 mt-3 border border-black bg-[#f48b9a] hover:bg-pink-200 text-white hover:text-black py-2 px-4 rounded">
        <ExportCSVButton />
      </div>
    </div>
  );
}

export default EditDataPage;
