export default function DanhSachVatTu({ items, onChange, readOnly }) {
  const add = () =>
    onChange([...items, { ten_vat_tu: '', don_vi: '', so_luong: '', mo_ta: '' }]);

  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  const update = (idx, field, value) =>
    onChange(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));

  return (
    <div className="danh-sach-vat-tu">
      <table className="vat-tu-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên vật tư</th>
            <th>Đơn vị</th>
            <th>Số lượng</th>
            <th>Mô tả</th>
            {!readOnly && <th></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>
                {readOnly ? item.ten_vat_tu : (
                  <input
                    value={item.ten_vat_tu}
                    onChange={(e) => update(idx, 'ten_vat_tu', e.target.value)}
                    placeholder="Tên vật tư"
                    required
                  />
                )}
              </td>
              <td>
                {readOnly ? item.don_vi : (
                  <input
                    value={item.don_vi}
                    onChange={(e) => update(idx, 'don_vi', e.target.value)}
                    placeholder="m, kg, cái..."
                  />
                )}
              </td>
              <td>
                {readOnly ? item.so_luong : (
                  <input
                    type="number"
                    min="1"
                    value={item.so_luong}
                    onChange={(e) => update(idx, 'so_luong', e.target.value)}
                    placeholder="0"
                    required
                  />
                )}
              </td>
              <td>
                {readOnly ? item.mo_ta : (
                  <input
                    value={item.mo_ta}
                    onChange={(e) => update(idx, 'mo_ta', e.target.value)}
                    placeholder="Ghi chú thêm"
                  />
                )}
              </td>
              {!readOnly && (
                <td>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => remove(idx)}
                    disabled={items.length === 1}
                  >
                    ✕
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <button type="button" className="btn-add-row" onClick={add}>
          + Thêm vật tư
        </button>
      )}
    </div>
  );
}
