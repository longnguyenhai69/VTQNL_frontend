import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaoPhieu from './pages/TaoPhieu';
import DanhSachPhieu from './pages/DanhSachPhieu';
import ChiTietPhieu from './pages/ChiTietPhieu';
import LichSuPhieu from './pages/LichSuPhieu';
import QuanLyTaiKhoan from './pages/QuanLyTaiKhoan';
import QuanLyPhieu from './pages/QuanLyPhieu';

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />

          <Route
            path="/phieu/tao-moi"
            element={
              <ProtectedRoute allowedRoles={['cong_truong']}>
                <Layout><TaoPhieu /></Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/phieu" element={<AppLayout><DanhSachPhieu /></AppLayout>} />
          <Route path="/phieu/:id" element={<AppLayout><ChiTietPhieu /></AppLayout>} />

          <Route
            path="/duyet"
            element={
              <ProtectedRoute allowedRoles={['nv_ky_thuat', 'tp_ky_thuat', 'pho_tgd']}>
                <Layout><DanhSachPhieu /></Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/nhan-phieu"
            element={
              <ProtectedRoute allowedRoles={['vat_tu']}>
                <Layout><DanhSachPhieu /></Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/lich-su" element={<AppLayout><LichSuPhieu /></AppLayout>} />

          <Route
            path="/quan-ly-tai-khoan"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout><QuanLyTaiKhoan /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-ly-phieu"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout><QuanLyPhieu /></Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
