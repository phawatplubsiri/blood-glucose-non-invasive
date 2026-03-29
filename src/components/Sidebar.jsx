import React from "react";

function Sidebar({ isOpen, onSelectModel, selectedModel, onClose }) {
  const models = [
    { name: "multiple-linear-regression", label: "Multiple Linear Regression" },
    { name: "decision-tree", label: "Decision Tree" },
    { name: "random-forest", label: "Random Forest" },
    { name: "deep-neural-network", label: "Deep Neural Network (DNN)" },
    {
      name: "convolutional-neural-network",
      label: "1D Convolutional Neural Network (1D CNN)",
    },
  ];

  return (
    <div
      className={`fixed top-[66px] md:top-[96px] left-0 w-72 h-[calc(100vh-66px)] md:h-[calc(100vh-96px)] bg-[#f7d9d9] text-black shadow-lg font-mitr p-6 transition-transform duration-300 z-50 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* หัวข้อที่มี animation */}
      <h2 className="text-xl mb-6 font-semibold relative inline-block overflow-hidden before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[4px] before:bg-[#f48b9a] before:rounded-full">
        ชนิดโมเดล
        <span
          className="
      absolute bottom-0 left-0 h-[4px] w-full rounded-full bg-[#f48b9a] animate-[underlineMove_2s_ease-in-out_infinite_alternate]
      [@keyframes_underlineMove]:{0%{transform:translateX(-100%);opacity:0.6;}50%{transform:translateX(0);opacity:1;}100%{transform:translateX(100%);opacity:0.6;}}"
        />
      </h2>

      {models.map((m) => (
        <button
          key={m.name}
          className={`
    relative block px-4 py-3 mb-3 w-full text-left rounded-3xl overflow-hidden
    transition-all duration-300 cursor-pointer
    ${
      selectedModel === m.name
        ? "bg-[#f48b9a] text-white scale-[1.03]"
        : "bg-[#fff0f0] hover:scale-[1.1]"
    }
    before:content-[''] before:absolute before:left-0 before:bottom-0
    before:h-[3px] before:bg-[#f48b9a] before:w-0
    hover:before:w-full before:transition-all before:duration-700
  `}
          onClick={() => {
            onSelectModel(m.name);
            onClose();
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
