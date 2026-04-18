import { useState } from 'react';

const DEFAULTS = {
  title: '',
  description: '',
  priority: 'Medium',
  severity: 'Minor',
  status: 'Open',
  assigned_to: '',
};

export default function IssueForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...DEFAULTS, ...initial });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    if (!payload.assigned_to) delete payload.assigned_to;
    onSubmit(payload);
  };

  const isEdit = !!initial.id;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className="form-input"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Brief summary of the issue"
        />
        {errors.title && <span style={{ color: 'var(--critical)', fontSize: 13 }}>{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the issue in detail..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-input" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Severity</label>
          <select className="form-input" value={form.severity} onChange={(e) => set('severity', e.target.value)}>
            <option>Minor</option>
            <option>Major</option>
            <option>Critical</option>
            <option>Blocker</option>
          </select>
        </div>
      </div>

      {isEdit && (
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : null}
          {isEdit ? 'Save Changes' : 'Create Issue'}
        </button>
      </div>
    </form>
  );
}
