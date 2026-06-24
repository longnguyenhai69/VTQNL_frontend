import { useEffect, useState } from 'react';
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

export default function LichSuPhieu() {
  const [phieus, setPhieus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/api/phieu/lich-su').then((data) => {
      setPhieus(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = phieus.filter((p) =>
    p.ma_phieu?.toLowerCase().includes(search.toLowerCase()) ||
    p.ten_cong_truong?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page"><p>Đang tải...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Lịch sử phiếu</h1>
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
          <p>Chưa có phiếu nào hoàn thành hoặc bị từ chối.</p>
        </div>
      ) : (
        <div className="phieu-list">
          {filtered.map((p) => (
            <div key={p.id} className="phieu-card phieu-card-expandable">
              <div
                className="phieu-card-header"
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className="ma-phieu">{p.ma_phieu}</span>
                <TrangThaiPhieu trangThai={p.trang_thai} />
                <span className="expand-toggle">{expanded === p.id ? '▲' : '▼'}</span>
              </div>

              <div className="phieu-card-body">
                <p><strong>Công trường:</strong> {p.ten_cong_truong}</p>
                <p><strong>Người lập:</strong> {p.nguoi_lap}</p>
                <p><strong>Ngày lập:</strong> {p.ngay_lap ? new Date(p.ngay_lap).toLocaleDateString('vi-VN') : ''}</p>
              </div>

              {expanded === p.id && (
                <div className="phieu-card-detail">
                  {p.trang_thai === 'hoan_thanh' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                      <button className="btn-export" onClick={() => xuatExcelPhieu(p)}>
                        Xuất Excel
                      </button>
                    </div>
                  )}
                  {p.ghi_chu && (
                    <div className="detail-row" style={{ padding: '0 0 12px' }}>
                      <span>Ghi chú</span>
                      <strong>{p.ghi_chu}</strong>
                    </div>
                  )}

                  <h4 style={{ margin: '0 0 8px' }}>Danh sách vật tư</h4>
                  <DanhSachVatTu items={p.danh_sach_vat_tu || []} readOnly />

                  <h4 style={{ margin: '16px 0 8px' }}>Lịch sử duyệt</h4>
                  <div className="timeline">
                    {(p.lich_su_duyet || []).length === 0 ? (
                      <p className="empty-text">Chưa có bước duyệt nào.</p>
                    ) : (
                      p.lich_su_duyet.map((item, idx) => (
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
