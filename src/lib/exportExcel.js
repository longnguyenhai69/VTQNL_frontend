import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function xuatExcelPhieu(phieu) {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(`${BASE_URL}/api/phieu/${phieu.id}/export`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { alert('Xuất Excel thất bại.'); return; }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${phieu.ma_phieu}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
