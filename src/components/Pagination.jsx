export default function Pagination({ pagination, onPage }) {
  const { page, pages, total, limit } = pagination;
  if (pages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const getPages = () => {
    const arr = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
        arr.push(i);
      } else if (arr[arr.length - 1] !== '...') {
        arr.push('...');
      }
    }
    return arr;
  };

  const btnStyle = (active) => ({
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? 'none' : '1px solid var(--border)',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--text-2)',
    transition: 'all 0.15s',
    fontFamily: 'var(--font)',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
      <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
        Showing {from}–{to} of {total} issues
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        <button style={btnStyle(false)} onClick={() => onPage(page - 1)} disabled={page === 1}>‹</button>
        {getPages().map((p, i) =>
          p === '...'
            ? <span key={i} style={{ width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13 }}>…</span>
            : <button key={p} style={btnStyle(p === page)} onClick={() => onPage(p)}>{p}</button>
        )}
        <button style={btnStyle(false)} onClick={() => onPage(page + 1)} disabled={page === pages}>›</button>
      </div>
    </div>
  );
}
