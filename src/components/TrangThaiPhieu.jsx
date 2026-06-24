const CONFIG = {
  cho_nv_ky_thuat: { label: 'Chờ NV kỹ thuật duyệt', color: '#f59e0b' },
  cho_tp_ky_thuat: { label: 'Chờ TP kỹ thuật duyệt', color: '#f97316' },
  cho_pho_tgd:     { label: 'Chờ Phó TGĐ duyệt', color: '#3b82f6' },
  cho_vat_tu:      { label: 'Chờ vật tư tiếp nhận', color: '#8b5cf6' },
  hoan_thanh:      { label: 'Hoàn thành', color: '#10b981' },
  tu_choi:         { label: 'Từ chối', color: '#ef4444' },
};

export default function TrangThaiPhieu({ trangThai }) {
  const cfg = CONFIG[trangThai] || { label: trangThai, color: '#6b7280' };
  return (
    <span className="trang-thai-badge" style={{ backgroundColor: cfg.color }}>
      {cfg.label}
    </span>
  );
}
