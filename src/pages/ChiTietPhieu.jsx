import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import TrangThaiPhieu from '../components/TrangThaiPhieu';
import DanhSachVatTu from '../components/DanhSachVatTu';
import { xuatExcelPhieu } from '../lib/exportExcel';

const BUOC_LABELS = {
  nv_ky_thuat: 'Nhân viên kỹ thuật',
  tp_ky_thuat: 'Trưởng phòng kỹ thuật',
  pho_tgd: 'Phó TGĐ',
  vat_tu: 'Phòng vật tư',
};

export default function ChiTietPhieu() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [phieu, setPhieu] = useState(null);
  const [ghiChu, setGhiChu] = useState('');
  const [danhSachEdit, setDanhSachEdit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/api/phieu/${id}`).then((data) => {
      setPhieu(data);
      setDanhSachEdit(data.danh_sach_vat_tu || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const canEditVatTu = () =>
    (profile?.role === 'nv_ky_thuat' && phieu?.trang_thai === 'cho_nv_ky_thuat') ||
    (profile?.role === 'tp_ky_thuat' && phieu?.trang_thai === 'cho_tp_ky_thuat');

  const handleSaveVatTu = async () => {
    const invalid = danhSachEdit.some((i) => !i.ten_vat_tu || !i.so_luong);
    if (invalid) { alert('Vui lòng điền đầy đủ tên vật tư và số lượng.'); return; }
    setSaving(true);
    try {
      await api.patch(`/api/phieu/${id}/vat-tu`, {
        danh_sach_vat_tu: danhSachEdit.map((i) => ({ ...i, so_luong: Number(i.so_luong) })),
      });
      setPhieu((p) => ({ ...p, danh_sach_vat_tu: danhSachEdit }));
      alert('Đã lưu danh sách vật tư.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const canApprove = () => {
    if (!phieu || !profile) return false;
    return (
      (profile.role === 'nv_ky_thuat' && phieu.trang_thai === 'cho_nv_ky_thuat') ||
      (profile.role === 'tp_ky_thuat' && phieu.trang_thai === 'cho_tp_ky_thuat') ||
      (profile.role === 'pho_tgd' && phieu.trang_thai === 'cho_pho_tgd') ||
      (profile.role === 'vat_tu' && phieu.trang_thai === 'cho_vat_tu')
    );
  };

  const handleAction = async (hanh_dong) => {
    if (hanh_dong === 'tu_choi' && !ghiChu.trim()) {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }
    setSubmitting(true);
    try {
      await api.patch(`/api/phieu/${id}/duyet`, { hanh_dong, ghi_chu: ghiChu });
      navigate(-1);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><p>Đang tải...</p></div>;
  if (!phieu) return <div className="page"><p>Không tìm thấy phiếu.</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← Quay lại</button>
        <h1>{phieu.ma_phieu}</h1>
        <TrangThaiPhieu trangThai={phieu.trang_thai} />
        {phieu.trang_thai === 'hoan_thanh' && (
          <button className="btn-export" onClick={() => xuatExcelPhieu(phieu)}>
            Xuất Excel
          </button>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Thông tin chung</h3>
          <div className="detail-row"><span>Công trường</span><strong>{phieu.ten_cong_truong}</strong></div>
          <div className="detail-row"><span>Người lập</span><strong>{phieu.nguoi_lap}</strong></div>
          <div className="detail-row">
            <span>Ngày lập</span>
            <strong>{phieu.ngay_lap ? new Date(phieu.ngay_lap).toLocaleDateString('vi-VN') : ''}</strong>
          </div>
          {phieu.ghi_chu && (
            <div className="detail-row"><span>Ghi chú</span><strong>{phieu.ghi_chu}</strong></div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>Danh sách vật tư đề xuất</h3>
        <DanhSachVatTu
          items={canEditVatTu() ? danhSachEdit : (phieu.danh_sach_vat_tu || [])}
          onChange={canEditVatTu() ? setDanhSachEdit : undefined}
          readOnly={!canEditVatTu()}
        />
        {canEditVatTu() && (
          <div style={{ marginTop: '12px' }}>
            <button className="btn-primary" onClick={handleSaveVatTu} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi vật tư'}
            </button>
          </div>
        )}
      </div>

      <div className="section">
        <h3>Lịch sử duyệt</h3>
        <div className="timeline">
          {(phieu.lich_su_duyet || []).length === 0 ? (
            <p className="empty-text">Chưa có bước duyệt nào.</p>
          ) : (
            phieu.lich_su_duyet.map((item, idx) => (
              <div key={idx} className={`timeline-item ${item.hanh_dong}`}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{BUOC_LABELS[item.buoc] || item.buoc}</strong>
                    <span className={`action-badge ${item.hanh_dong}`}>
                      {item.hanh_dong === 'duyet' ? 'Đã duyệt' : 'Từ chối'}
                    </span>
                  </div>
                  <p className="timeline-person">{item.nguoi_duyet}</p>
                  {item.ghi_chu && <p className="timeline-note">{item.ghi_chu}</p>}
                  <p className="timeline-time">
                    {item.thoi_gian ? new Date(item.thoi_gian).toLocaleString('vi-VN') : ''}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {canApprove() && (
        <div className="section approve-section">
          <h3>
            {profile.role === 'vat_tu' ? 'Xác nhận tiếp nhận' : 'Xét duyệt'}
          </h3>
          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              rows={3}
              placeholder={profile.role === 'vat_tu' ? 'Ghi chú tiếp nhận...' : 'Ghi chú (bắt buộc nếu từ chối)...'}
            />
          </div>
          <div className="form-actions">
            <button
              className="btn-danger"
              onClick={() => handleAction('tu_choi')}
              disabled={submitting}
            >
              Từ chối
            </button>
            <button
              className="btn-primary"
              onClick={() => handleAction('duyet')}
              disabled={submitting}
            >
              {profile.role === 'vat_tu' ? 'Xác nhận tiếp nhận' : 'Duyệt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
