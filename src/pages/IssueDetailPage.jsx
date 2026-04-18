import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { issuesAPI } from '../api';
import useIssuesStore from '../store/issuesStore';
import { StatusBadge, PriorityBadge, SeverityBadge } from '../components/Badges';
import Modal from '../components/Modal';
import IssueForm from '../components/IssueForm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateIssue, deleteIssue } = useIssuesStore();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(null); // 'Resolved' | 'Closed'
  const [showDelete, setShowDelete] = useState(false);

  const load = async () => {
    try {
      const res = await issuesAPI.get(id);
      setIssue(res.data.issue);
    } catch {
      toast.error('Issue not found');
      navigate('/issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleEdit = async (data) => {
    setEditLoading(true);
    try {
      const updated = await updateIssue(id, data);
      setIssue((i) => ({ ...i, ...updated }));
      toast.success('Issue updated');
      setShowEdit(false);
      load();
    } catch {
      toast.error('Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateIssue(id, { status });
      toast.success(`Issue marked as ${status}`);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssue(id);
      toast.success('Issue deleted');
      navigate('/issues');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <span className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  if (!issue) return null;

  const isActive = !['Resolved', 'Closed'].includes(issue.status);

  return (
    <div style={{ padding: '40px 40px', maxWidth: 860 }} className="fade-in">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 13, color: 'var(--text-3)' }}>
        <Link to="/issues" style={{ color: 'var(--text-3)', textDecoration: 'none' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-3)'}
        >Issues</Link>
        <span>/</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>#{issue.id}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 14 }}>
            {issue.title}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
            <SeverityBadge severity={issue.severity} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(true)}>✎ Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>Delete</button>
        </div>
      </div>

      {/* Status Actions */}
      {isActive && (
        <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
          <span style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 600 }}>Change status</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {issue.status !== 'In Progress' && (
              <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange('In Progress')}>
                Mark In Progress
              </button>
            )}
            <button className="btn btn-sm" style={{ background: 'var(--resolved-bg)', color: 'var(--resolved)', border: '1px solid rgba(129,140,248,0.2)' }}
              onClick={() => setConfirmStatus('Resolved')}>
              ✓ Resolve
            </button>
            <button className="btn btn-ghost btn-sm"
              onClick={() => setConfirmStatus('Closed')}>
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Description
        </h3>
        {issue.description ? (
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>{issue.description}</p>
        ) : (
          <p style={{ color: 'var(--text-3)', fontSize: 14, fontStyle: 'italic' }}>No description provided.</p>
        )}
      </div>

      {/* Metadata */}
      <div className="card">
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
          Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Created by', value: issue.creator_name || '—' },
            { label: 'Assigned to', value: issue.assignee_name || 'Unassigned' },
            { label: 'Created', value: new Date(issue.created_at).toLocaleString() },
            { label: 'Last updated', value: new Date(issue.updated_at).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Issue">
        <IssueForm
          initial={{ ...issue }}
          onSubmit={handleEdit}
          onCancel={() => setShowEdit(false)}
          loading={editLoading}
        />
      </Modal>

      {/* Status Confirm */}
      <ConfirmDialog
        open={!!confirmStatus}
        onClose={() => setConfirmStatus(null)}
        onConfirm={() => handleStatusChange(confirmStatus)}
        title={`Mark as ${confirmStatus}`}
        message={`Are you sure you want to mark this issue as "${confirmStatus}"? ${confirmStatus === 'Closed' ? 'This will close the issue.' : ''}`}
        confirmLabel={confirmStatus === 'Resolved' ? '✓ Resolve' : '✕ Close'}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Issue"
        message="This will permanently delete this issue. This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
