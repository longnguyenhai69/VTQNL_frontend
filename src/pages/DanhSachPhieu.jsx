import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import TrangThaiPhieu from '../components/TrangThaiPhieu';

export default function DanhSachPhieu() {
  const { profile } = useAuth();
  const [phieus, setPhieus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const endpoint = profile?.role === 'cong_truong'
    ? '/api/phieu/cua-toi'
    : profile?.role === 'nv_ky_thuat'
    ? '/api/phieu?trang_thai=cho_nv_ky_thuat'
    : profile?.role === 'tp_ky_thuat'
    ? '/api/phieu?trang_thai=cho_tp_ky_thuat'
    : profile?.role === 'pho_tgd'
    ? '/api/phieu?trang_thai=cho_pho_tgd'
    : '/api/phieu?trang_thai=cho_vat_tu';

  useEffect(() => {
    api.get(endpoint).then((data) => {
      setPhieus(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [endpoint]);

  const filtered = phieus.filter((p) =>
    p.ma_phieu?.toLowerCase().includes(search.toLowerCase()) ||
    p.ten_cong_truong?.toLowerCase().includes(search.toLowerCase())
  );

  // Nhóm theo công trường cho NV kỹ thuật
  const grouped = profile?.role === 'nv_ky_thuat'
    ? filtered.reduce((acc, p) => {
        const key = p.ten_cong_truong || 'Không rõ';
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
      }, {})
    : null;

  if (loading) return <div className="page"><p>Đang tải...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>
          {profile?.role === 'cong_truong' ? 'Phiếu của tôi' : 'Phiếu chờ duyệt'}
        </h1>
        {profile?.role === 'cong_truong' && (
          <Link to="/phieu/tao-moi" className="btn-primary">+ Tạo mới</Link>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm theo mã phiếu hoặc công trường..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Không có phiếu nào.</p>
        </div>
      ) : grouped ? (
        // Hiển thị nhóm theo công trường cho NV kỹ thuật
        Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, 'vi')).map(([tenCongTruong, ds]) => (
          <div key={tenCongTruong} className="cong-truong-group">
            <div className="cong-truong-group-header">
              <h3>{tenCongTruong}</h3>
              <span className="group-count">{ds.length} phiếu</span>
            </div>
            <div className="phieu-list">
              {ds.map((p) => (
                <PhieuCard key={p.id} p={p} showCongTruong={false} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="phieu-list">
          {filtered.map((p) => (
            <PhieuCard key={p.id} p={p} showCongTruong={profile?.role !== 'cong_truong'} />
          ))}
        </div>
      )}
    </div>
  );
}

function PhieuCard({ p, showCongTruong }) {
  return (
    <Link to={`/phieu/${p.id}`} className="phieu-card">
      <div className="phieu-card-header">
        <span className="ma-phieu">{p.ma_phieu}</span>
        <TrangThaiPhieu trangThai={p.trang_thai} />
      </div>
      <div className="phieu-card-body">
        {showCongTruong && <p><strong>Công trường:</strong> {p.ten_cong_truong}</p>}
        <p><strong>Người lập:</strong> {p.nguoi_lap}</p>
        <p><strong>Số vật tư:</strong> {p.danh_sach_vat_tu?.length || 0} loại</p>
      </div>
      <div className="phieu-card-footer">
        <span>{p.ngay_lap ? new Date(p.ngay_lap).toLocaleDateString('vi-VN') : ''}</span>
      </div>
    </Link>
  );
}
