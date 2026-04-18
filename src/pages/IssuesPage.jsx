import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useIssuesStore from '../store/issuesStore';
import { useDebounce } from '../hooks/useDebounce';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import Modal from '../components/Modal';
import IssueForm from '../components/IssueForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';

export default function IssuesPage() {
  const {
    issues, pagination, loading, filters,
    setFilters, fetchIssues, fetchStats,
    createIssue, deleteIssue, exportIssues,
  } = useIssuesStore();

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Sync debounced search into store
  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  // Fetch whenever filters change
  useEffect(() => {
    fetchIssues(1);
  }, [filters]);

  const handleCreate = async (data) => {
    setCreateLoading(true);
    try {
      await createIssue(data);
      toast.success('Issue created');
      setShowCreate(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssue(deleteTarget);
      toast.success('Issue deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleExport = async (format) => {
    try {
      await exportIssues(format);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error('Export failed');
    }
  };

  const filterStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px',
    color: 'var(--text)',
    fontSize: 13,
    fontFamily: 'var(--font)',
    cursor: 'pointer',
    appearance: 'none',
    minWidth: 120,
  };

  return (
    <div style={{ padding: '40px 40px' }} className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 6 }}>
            All Issues
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Issue Tracker</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportMenu onExport={handleExport} />
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            + New Issue
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ flex: 1, minWidth: 200, fontSize: 14, padding: '8px 14px' }}
          placeholder="🔍  Search by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select style={filterStyle} value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
          <option value="">All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
        <select style={filterStyle} value={filters.priority} onChange={(e) => setFilters({ priority: e.target.value })}>
          <option value="">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <select style={filterStyle} value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value })}>
          <option value="created_at">Sort: Date</option>
          <option value="title">Sort: Title</option>
          <option value="priority">Sort: Priority</option>
          <option value="status">Sort: Status</option>
        </select>
        <select style={filterStyle} value={filters.order} onChange={(e) => setFilters({ order: e.target.value })}>
          <option value="DESC">Newest first</option>
          <option value="ASC">Oldest first</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}><span className="spinner" /></div>
        ) : issues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 56, color: 'var(--text-3)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>No issues found</p>
            <p style={{ fontSize: 14 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Title', 'Status', 'Priority', 'Created', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                    color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, i) => (
                <tr key={issue.id} style={{
                  borderBottom: i < issues.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-3)' }}>#{issue.id}</span>
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: 300 }}>
                    <Link to={`/issues/${issue.id}`} style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text)'}
                    >
                      {issue.title}
                    </Link>
                    {issue.creator_name && (
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>by {issue.creator_name}</div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={issue.status} /></td>
                  <td style={{ padding: '14px 16px' }}><PriorityBadge priority={issue.priority} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-3)' }}>
                    {new Date(issue.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/issues/${issue.id}`} className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}>
                        View
                      </Link>
                      <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => setDeleteTarget(issue.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination pagination={pagination} onPage={(p) => fetchIssues(p)} />

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Issue">
        <IssueForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={createLoading}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Issue"
        message={`Are you sure you want to permanently delete issue #${deleteTarget}? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

function ExportMenu({ onExport }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen((v) => !v)}>↓ Export</button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%', zIndex: 20,
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', overflow: 'hidden', minWidth: 150,
          boxShadow: 'var(--shadow)',
        }}
          onMouseLeave={() => setOpen(false)}
        >
          {['csv', 'json'].map((fmt) => (
            <button key={fmt} onClick={() => { onExport(fmt); setOpen(false); }} style={{
              display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left',
              background: 'none', color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font)', cursor: 'pointer',
              borderBottom: fmt === 'csv' ? '1px solid var(--border)' : 'none',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              Export as {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}