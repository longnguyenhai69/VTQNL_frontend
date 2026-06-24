import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import TrangThaiPhieu from '../components/TrangThaiPhieu';

const TRANG_THAI_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'cho_nv_ky_thuat', label: 'Chờ NV kỹ thuật' },
  { value: 'cho_tp_ky_thuat', label: 'Chờ TP kỹ thuật' },
  { value: 'cho_pho_tgd',     label: 'Chờ Phó TGĐ' },
  { value: 'cho_vat_tu',      label: 'Chờ vật tư' },
  { value: 'hoan_thanh',      label: 'Hoàn thành' },
  { value: 'tu_choi',         label: 'Từ chối' },
];

export default function QuanLyPhieu() {
  const [phieus, setPhieus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTT, setFilterTT] = useState('');

  const fetchPhieus = () => {
    setLoading(true);
    api.get('/api/phieu/tat-ca').then((data) => {
      setPhieus(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPhieus(); }, []);

  const handleXoa = async (p) => {
    if (!confirm(`Xóa phiếu "${p.ma_phieu}" của ${p.ten_cong_truong}?`)) return;
    try {
      await api.delete(`/api/phieu/${p.id}`);
      setPhieus((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = phieus.filter((p) => {
    const matchSearch =
      p.ma_phieu?.toLowerCase().includes(search.toLowerCase()) ||
      p.ten_cong_truong?.toLowerCase().includes(search.toLowerCase()) ||
      p.nguoi_lap?.toLowerCase().includes(search.toLowerCase());
    const matchTT = filterTT ? p.trang_thai === filterTT : true;
    return matchSearch && matchTT;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Quản lý phiếu</h1>
        <span style={{ color: '#64748b', fontSize: '14px' }}>{filtered.length} phiếu</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          className="search-input"
          type="text"
          placeholder="Tìm theo mã phiếu, công trường, người lập..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
        />
        <select
          value={filterTT}
          onChange={(e) => setFilterTT(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' }}
        >
          {TRANG_THAI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? <p>Đang tải...</p> : filtered.length === 0 ? (
        <div className="empty-state"><p>Không có phiếu nào.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="vat-tu-table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Công trường</th>
                <th>Người lập</th>
                <th>Ngày lập</th>
                <th>Trạng thái</th>
                <th>Số vật tư</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><Link to={`/phieu/${p.id}`} style={{ color: '#3b82f6', fontWeight: 600 }}>{p.ma_phieu}</Link></td>
                  <td>{p.ten_cong_truong}</td>
                  <td>{p.nguoi_lap}</td>
                  <td>{p.ngay_lap ? new Date(p.ngay_lap).toLocaleDateString('vi-VN') : ''}</td>
                  <td><TrangThaiPhieu trangThai={p.trang_thai} /></td>
                  <td style={{ textAlign: 'center' }}>{p.danh_sach_vat_tu?.length || 0}</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleXoa(p)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
