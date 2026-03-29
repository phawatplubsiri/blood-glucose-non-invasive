import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import ExportCSVButton from "./components/ExportCSVButton";
import useDynamicTitle from "./hooks/DynamicTitle";
import ModelPage from "./pages/ModelPage";
import EditDataPage from "./pages/EditDataPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useDynamicTitle();
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-data"
          element={
            <ProtectedRoute>
              <EditDataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/model-dashboard"
          element={
            <ProtectedRoute>
              <ModelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/model-dashboard/:modelName"
          element={
            <ProtectedRoute>
              <ModelPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
