import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import DanhSachVatTu from '../components/DanhSachVatTu';

const emptyItem = () => ({ ten_vat_tu: '', don_vi: '', so_luong: '', mo_ta: '' });

export default function TaoPhieu() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [danhSach, setDanhSach] = useState([emptyItem()]);
  const [tenCongTruong, setTenCongTruong] = useState(profile?.ten_cong_truong || profile?.ho_ten || '');
  const [ghiChu, setGhiChu] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!tenCongTruong.trim()) {
      setError('Vui lòng nhập tên công trường.');
      setLoading(false);
      return;
    }
    const invalid = danhSach.some((i) => !i.ten_vat_tu || !i.so_luong);
    if (invalid) {
      setError('Vui lòng điền đầy đủ tên vật tư và số lượng.');
      return;
    }
    setLoading(true);
    try {
      const phieu = await api.post('/api/phieu', {
        ten_cong_truong: tenCongTruong,
        ghi_chu: ghiChu,
        danh_sach_vat_tu: danhSach.map((i) => ({
          ...i,
          so_luong: Number(i.so_luong),
        })),
      });
      navigate(`/phieu/${phieu.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tạo phiếu đề xuất vật tư</h1>
      </div>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Công trường</label>
          <input
            value={tenCongTruong}
            onChange={(e) => setTenCongTruong(e.target.value)}
            placeholder="Nhập tên công trường..."
            required
          />
        </div>
        <div className="form-group">
          <label>Ghi chú / Lý do đề xuất</label>
          <textarea
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            rows={3}
            placeholder="Mô tả lý do cần vật tư..."
          />
        </div>
        <div className="form-group">
          <label>Danh sách vật tư đề xuất</label>
          <DanhSachVatTu items={danhSach} onChange={setDanhSach} />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi đề xuất'}
          </button>
        </div>
      </form>
    </div>
  );
}
