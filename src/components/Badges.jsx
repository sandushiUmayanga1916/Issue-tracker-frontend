const STATUS_MAP = {
  'Open': 'open',
  'In Progress': 'inprogress',
  'Resolved': 'resolved',
  'Closed': 'closed',
};

const PRIORITY_MAP = {
  'Low': 'low',
  'Medium': 'medium',
  'High': 'high',
  'Critical': 'critical',
};

const STATUS_DOT = {
  'Open': '#4ade80',
  'In Progress': '#fb923c',
  'Resolved': '#818cf8',
  'Closed': '#64748b',
};

export function StatusBadge({ status }) {
  const cls = STATUS_MAP[status] || 'closed';
  return (
    <span className={`badge badge-${cls}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_DOT[status] || '#64748b', display: 'inline-block' }} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cls = PRIORITY_MAP[priority] || 'medium';
  return <span className={`badge badge-${cls}`}>{priority}</span>;
}

export function SeverityBadge({ severity }) {
  const colors = { Minor: '#4ade80', Major: '#facc15', Critical: '#fb923c', Blocker: '#f87171' };
  const color = colors[severity] || '#9898b8';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      background: `${color}14`,
      color,
    }}>
      {severity}
    </span>
  );
}
