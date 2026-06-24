import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ROLE_LABELS = {
  admin: 'Quản trị',
  cong_truong: 'Công trường',
  nv_ky_thuat: 'NV Kỹ thuật',
  tp_ky_thuat: 'TP Kỹ thuật',
  pho_tgd: 'Phó TGĐ',
  vat_tu: 'Phòng vật tư',
};

export default function Layout({ children }) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = getNavItems(profile?.role);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Vật tư</h2>
          <p>{ROLE_LABELS[profile?.role]}</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{profile?.ho_ten}</p>
            <p className="user-role">{ROLE_LABELS[profile?.role]}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function getNavItems(role) {
  const common = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/lich-su', label: 'Lịch sử phiếu', icon: '📁' },
  ];
  if (role === 'cong_truong') {
    return [
      ...common,
      { path: '/phieu', label: 'Phiếu của tôi', icon: '📋' },
      { path: '/phieu/tao-moi', label: 'Tạo phiếu mới', icon: '➕' },
    ];
  }
  if (role === 'admin') {
    return [
      ...common,
      { path: '/quan-ly-phieu', label: 'Quản lý phiếu', icon: '📋' },
      { path: '/quan-ly-tai-khoan', label: 'Quản lý tài khoản', icon: '👤' },
    ];
  }
  if (role === 'nv_ky_thuat' || role === 'tp_ky_thuat' || role === 'pho_tgd') {
    return [
      ...common,
      { path: '/duyet', label: 'Chờ duyệt', icon: '⏳' },
    ];
  }
  if (role === 'vat_tu') {
    return [
      ...common,
      { path: '/nhan-phieu', label: 'Nhận phiếu', icon: '📦' },
    ];
  }
  return common;
}
