import React from "react";
import { editableFields } from "../constants/fields";

function EditTableRow({
  item,
  index,
  editingId,
  formData,
  fields,
  onEditClick,
  onCancel,
  onChange,
  onUpdate,
}) {
  return (
    <tr key={item.id} className="border border-black">
      {/* ลำดับแถว */}
      <td className="border border-black p-2 text-center">{index}</td>

      {/* วนแสดงช่องตาม fields */}
      {fields.map((field) => (
        <td key={field.key} className="border border-black p-2 text-center">
          {editingId === item.id && editableFields.includes(field.key) ? (
            // ถ้าอยู่ในโหมดแก้ไข + ฟิลด์นี้แก้ได้
            field.key === "gender" ? (
              // ถ้าเป็น gender ให้ใช้ radio
              <div className="flex gap-4 justify-center">
                {[
                  { label: "ชาย", value: "male" },
                  { label: "หญิง", value: "female" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={opt.value}
                      checked={formData.gender === opt.value}
                      onChange={onChange}
                      className="hidden"
                      required
                    />
                    {/* วงกลม radio */}
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
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              // input สำหรับฟิลด์ทั่วไป
              <input
                name={field.key}
                value={formData[field.key] || ""}
                onChange={onChange}
                className="border px-2 py-1 w-full text-sm"
                autoComplete="off"
                required
              />
            )
          ) : (
            // ถ้าไม่อยู่ในโหมดแก้ไขก็แค่โชว์ข้อมูล
            item[field.key] ?? "-"
          )}
        </td>
      ))}

      {/* ปุ่มยืนยัน / ยกเลิก / แก้ไข */}
      <td className="p-2 flex justify-center gap-2">
        {editingId === item.id ? (
          <>
            <button
              onClick={() => onUpdate(item.id)}
              className="bg-[#f48b9a] hover:bg-pink-200 text-white hover:text-black px-3 py-1 rounded cursor-pointer"
            >
              ยืนยัน
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white hover:text-black px-3 py-1 rounded cursor-pointer"
            >
              ยกเลิก
            </button>
          </>
        ) : (
          <button
            onClick={() => onEditClick(item)}
            className="bg-[#f48b9a] hover:bg-pink-200 text-white hover:text-black px-3 py-1 rounded cursor-pointer"
          >
            แก้ไข
          </button>
        )}
      </td>
    </tr>
  );
}

export default EditTableRow;
