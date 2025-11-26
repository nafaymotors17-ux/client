// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/404Page";

// Admin Components
import AdminLayout from "./components/Admin/Layout";
import Dashboard from "./components/Admin/pages/Dashboard";
import Purchased from "./components/Admin/pages/Purchased";
import Loaded from "./components/Admin/pages/Loaded";
import Available from "./components/Admin/pages/Available";
import Sold from "./components/Admin/pages/Sold";
import Released from "./components/Admin/pages/Released";
import ExpiringSoon from "./components/Admin/pages/ExpiringSoon";
import Expired from "./components/Admin/pages/Expired";
import ScrollToTop from "./Common/ScrollToTop";
import AllRecords from "./components/Admin/pages/AllRecords";
import LoadRequestTab from "./components/Admin/pages/LoadRequest";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Toaster position="top-right" richColors />
        <ScrollToTop />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="all" element={<AllRecords />} />
            <Route path="purchased" element={<Purchased />} />
            <Route path="load_requested" element={<LoadRequestTab />} />

            <Route path="loaded" element={<Loaded />} />
            <Route path="available" element={<Available />} />
            <Route path="sold" element={<Sold />} />
            <Route path="released" element={<Released />} />
            <Route path="expiring-soon" element={<ExpiringSoon />} />
            <Route path="expired" element={<Expired />} />
          </Route>

          {/* Not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
