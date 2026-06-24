import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const ROLE_LABELS = {
  admin: 'Quản trị',
  cong_truong: 'Công trường',
  nv_ky_thuat: 'NV Kỹ thuật',
  tp_ky_thuat: 'TP Kỹ thuật',
  pho_tgd: 'Phó TGĐ',
  vat_tu: 'Phòng vật tư',
};

const emptyForm = { email: '', password: '', ho_ten: '', role: 'cong_truong', ten_cong_truong: '' };

export default function QuanLyTaiKhoan() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'them' | 'sua'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/api/users').then((data) => { setUsers(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openThem = () => { setForm(emptyForm); setError(''); setModal('them'); };
  const openSua = (u) => {
    setSelected(u);
    setForm({ email: u.email, password: '', ho_ten: u.ho_ten, role: u.role, ten_cong_truong: u.ten_cong_truong || '' });
    setError('');
    setModal('sua');
  };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (modal === 'them') {
        await api.post('/api/users', form);
      } else {
        const payload = { ho_ten: form.ho_ten, role: form.role, ten_cong_truong: form.ten_cong_truong };
        if (form.password) payload.password = form.password;
        await api.patch(`/api/users/${selected.uid}`, payload);
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleXoa = async (u) => {
    if (!confirm(`Xóa tài khoản "${u.ho_ten}" (${u.email})?`)) return;
    try {
      await api.delete(`/api/users/${u.uid}`);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Quản lý tài khoản</h1>
        <button className="btn-primary" onClick={openThem}>+ Thêm tài khoản</button>
      </div>

      {loading ? <p>Đang tải...</p> : (
        <div className="table-wrapper">
          <table className="vat-tu-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Công trường</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid}>
                  <td>{u.ho_ten}</td>
                  <td>{u.email}</td>
                  <td><span className="trang-thai-badge" style={{ backgroundColor: '#6b7280' }}>{ROLE_LABELS[u.role] || u.role}</span></td>
                  <td>{u.ten_cong_truong || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-secondary" onClick={() => openSua(u)}>Sửa</button>
                      <button className="btn-danger" onClick={() => handleXoa(u)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{modal === 'them' ? 'Thêm tài khoản' : 'Sửa tài khoản'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ tên</label>
                <input value={form.ho_ten} onChange={(e) => setForm({ ...form, ho_ten: e.target.value })} required placeholder="Nguyễn Văn A" />
              </div>
              {modal === 'them' && (
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="email@congty.com" />
                </div>
              )}
              <div className="form-group">
                <label>{modal === 'them' ? 'Mật khẩu' : 'Mật khẩu mới (để trống nếu không đổi)'}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={modal === 'them'} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {Object.entries(ROLE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              {form.role === 'cong_truong' && (
                <div className="form-group">
                  <label>Tên công trường</label>
                  <input value={form.ten_cong_truong} onChange={(e) => setForm({ ...form, ten_cong_truong: e.target.value })} placeholder="Công trường Cầu Bình Lợi" />
                </div>
              )}
              {error && <p className="error-msg">{error}</p>}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
