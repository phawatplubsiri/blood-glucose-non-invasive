# Blood Glucose Final Project 💉📊

ระบบแดชบอร์ดสำหรับแสดงผลข้อมูลระดับน้ำตาลในเลือด พัฒนาโดยใช้ React และ Vite พร้อมการเชื่อมต่อกับ Firebase เหมาะสำหรับการเรียนรู้การพัฒนาเว็บแอปพลิเคชันที่มีการแสดงผลข้อมูลแบบเรียลไทม์

## 🔧 เทคโนโลยีที่ใช้

- **Frontend**: React (Javascript) + Vite
- **Charting**: Chart.js (ผ่าน React wrapper)
- **Backend**: Firebase SDK (สำหรับ Hosting และการตั้งค่า)
- **เครื่องมือเสริม**: ESLint, Vite config, Tailwindcss

## 📁 โครงสร้างโปรเจกต์

bg_final_project/ 
- src/ # React components และ assets 
- index.html # จุดเริ่มต้นของแอป 
- package.json # รายการ dependencies และ scripts 
- firebase.json # การตั้งค่า Firebase Hosting 
- .firebaserc # Firebase project alias 
- vite.config.js # การตั้งค่า Vite
- eslint.config.js # กฎการตรวจสอบโค้ด 
- README.md # เอกสารประกอบโปรเจกต์

## 🚀 วิธีเริ่มต้นใช้งาน

1. **ติดตั้ง dependencies**  ->  npm install
2. **รันเซิร์ฟเวอร์สำหรับพัฒนา**  ->  npm run dev
3. **Deploy ขึ้น Firebase หากต้องการ**  ->  firebase deploy


