import { useState } from "react";
import { auth } from "../configs/firebaseConfigs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navlogo from "../assets/bg-logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: "success",
        iconColor: "green",
        title: "ล็อกอินสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
        background: "#f7d9d9",
        customClass: {
          title: "font-mitr",
          popup: "font-mitr",
        },
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        background: "#f7d9d9",
        confirmButtonColor: "#f48b9a",
        customClass: {
          title: "font-mitr",
          popup: "font-mitr",
          confirmButton: "font-mitr",
          htmlContainer: "font-mitr",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-mitr">
      <div
        className="max-w-md w-full bg-[#f7d9d9] border-2 border-black rounded-lg p-8 shadow-lg"
        style={{
          animation: "fadeInUp 0.5s ease-out",
        }}
      >
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <img
            src={Navlogo}
            alt="Blood Glucose Logo"
            className="h-[100px] w-[100px] rounded-full border-3 border-black mx-auto mb-4 shadow-md"
          />
          <h2 className="text-3xl font-semibold text-black">เข้าสู่ระบบ</h2>
          <p className="text-black/60 text-sm mt-1">
            Blood Glucose Monitoring System
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block text-black text-sm font-medium mb-2"
              htmlFor="email"
            >
              อีเมล
            </label>
            <input
              className={`w-full px-4 py-2.5 bg-[#faeeee] border-2 rounded-lg text-black placeholder-black/40 outline-none transition-all duration-300 ${
                focusedField === "email"
                  ? "border-[#f48b9a] shadow-[0_0_0_3px_rgba(244,139,154,0.3)]"
                  : "border-black/30"
              }`}
              type="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              className="block text-black text-sm font-medium mb-2"
              htmlFor="password"
            >
              รหัสผ่าน
            </label>
            <input
              className={`w-full px-4 py-2.5 bg-[#faeeee] border-2 rounded-lg text-black placeholder-black/40 outline-none transition-all duration-300 ${
                focusedField === "password"
                  ? "border-[#f48b9a] shadow-[0_0_0_3px_rgba(244,139,154,0.3)]"
                  : "border-black/30"
              }`}
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            className={`w-full py-2.5 px-4 border-2 border-black rounded-4xl text-black font-medium text-lg cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#f7d9d9] to-[#f48b9a] hover:bg-gradient-to-tl hover:shadow-md active:scale-[0.98] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                กำลังโหลด...
              </span>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>
      </div>

      {/* Inline keyframes for fade-in animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
