const BUOC = [
  { key: 'nv_ky_thuat', label: 'NV Kỹ thuật', trang_thai: 'cho_nv_ky_thuat' },
  { key: 'tp_ky_thuat', label: 'TP Kỹ thuật', trang_thai: 'cho_tp_ky_thuat' },
  { key: 'pho_tgd',     label: 'Phó TGĐ',     trang_thai: 'cho_pho_tgd' },
  { key: 'vat_tu',      label: 'Vật tư',       trang_thai: 'cho_vat_tu' },
];

export default function TienDoPhieu({ phieu }) {
  const { lich_su_duyet = [], trang_thai } = phieu;

  return (
    <div className="tien-do">
      {BUOC.map((buoc, idx) => {
        const record = lich_su_duyet.find((h) => h.buoc === buoc.key);
        const status = record
          ? record.hanh_dong === 'duyet' ? 'done' : 'rejected'
          : trang_thai === buoc.trang_thai ? 'active' : 'pending';

        return (
          <div key={buoc.key} className={`tien-do-buoc ${status}`}>
            <div className="tien-do-icon">
              {status === 'done' && '✓'}
              {status === 'rejected' && '✕'}
              {status === 'active' && '…'}
              {status === 'pending' && idx + 1}
            </div>
            <div className="tien-do-info">
              <span className="tien-do-label">{buoc.label}</span>
              {record && (
                <span className="tien-do-nguoi">{record.nguoi_duyet}</span>
              )}
              {record?.ghi_chu && (
                <span className="tien-do-ghichu">"{record.ghi_chu}"</span>
              )}
            </div>
            {idx < BUOC.length - 1 && <div className="tien-do-line" />}
          </div>
        );
      })}
    </div>
  );
}
