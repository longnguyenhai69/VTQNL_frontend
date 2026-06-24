import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';

const ROLE_LABELS = {
  cong_truong: 'Công trường',
  nv_ky_thuat: 'NV Kỹ thuật',
  tp_ky_thuat: 'TP Kỹ thuật',
  pho_tgd: 'Phó TGĐ',
  vat_tu: 'Phòng vật tư',
};

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/api/stats').then(setStats).catch(() => {});
  }, []);

  return (
    <div className="page">
      <h1>Xin chào, {profile?.ho_ten}</h1>
      <p className="subtitle">
        {ROLE_LABELS[profile?.role]} — {new Date().toLocaleDateString('vi-VN')}
      </p>

      {stats && (
        <div className="stats-grid">
          {profile?.role === 'cong_truong' && (
            <>
              <StatCard label="Phiếu đã tạo" value={stats.tong} color="#3b82f6" />
              <StatCard label="Đang xử lý" value={stats.dang_xu_ly} color="#f59e0b" />
              <StatCard label="Hoàn thành" value={stats.hoan_thanh} color="#10b981" />
              <StatCard label="Từ chối" value={stats.tu_choi} color="#ef4444" />
            </>
          )}
          {(profile?.role === 'nv_ky_thuat' || profile?.role === 'tp_ky_thuat' || profile?.role === 'pho_tgd' || profile?.role === 'vat_tu') && (
            <>
              <StatCard label="Chờ duyệt" value={stats.cho_duyet} color="#f59e0b" />
              <StatCard label="Đã duyệt hôm nay" value={stats.duyet_hom_nay} color="#10b981" />
              <StatCard label="Tổng đã xử lý" value={stats.tong_xu_ly} color="#3b82f6" />
            </>
          )}
        </div>
      )}

      <div className="quick-actions">
        {profile?.role === 'cong_truong' && (
          <Link to="/phieu/tao-moi" className="btn-primary">Tạo phiếu đề xuất mới</Link>
        )}
        {(profile?.role === 'nv_ky_thuat' || profile?.role === 'tp_ky_thuat' || profile?.role === 'pho_tgd') && (
          <Link to="/duyet" className="btn-primary">Xem phiếu chờ duyệt</Link>
        )}
        {profile?.role === 'vat_tu' && (
          <Link to="/nhan-phieu" className="btn-primary">Xem phiếu chờ tiếp nhận</Link>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-value" style={{ color }}>{value ?? '–'}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
