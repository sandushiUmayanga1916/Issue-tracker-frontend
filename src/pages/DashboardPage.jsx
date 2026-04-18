import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';
import { HiStatusOnline } from 'react-icons/hi';
import useIssuesStore from '../store/issuesStore';
import useAuthStore from '../store/authStore';
import { GrInProgress } from 'react-icons/gr';
import { GoDiscussionClosed } from 'react-icons/go';
import { FaArrowAltCircleRight } from 'react-icons/fa';

const STAT_CARDS = [
  { label: 'Open', key: 'Open', color: 'var(--open)', bg: 'var(--open-bg)', icon: HiStatusOnline },
  { label: 'In Progress', key: 'In Progress', color: 'var(--inprogress)', bg: 'var(--inprogress-bg)', icon: GrInProgress },
  { label: 'Resolved', key: 'Resolved', color: 'var(--resolved)', bg: 'var(--resolved-bg)', icon: GoDiscussionClosed },
  { label: 'Closed', key: 'Closed', color: 'var(--closed)', bg: 'var(--closed-bg)', icon: FiXCircle },
];

export default function DashboardPage() {
  const { stats, issues, loading, fetchIssues, fetchStats } = useIssuesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStats();
    fetchIssues(1);
  }, []);

  const total = stats.total || 0;

  return (
    <div style={{ padding: '40px 40px' }} className="fade-in">

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          color: 'var(--text-3)',
          fontSize: 13,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
          marginBottom: 6
        }}>
          Welcome back
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>
          {user?.name}
        </h1>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 40
      }}>
        {STAT_CARDS.map(({ label, key, color, bg, icon }) => {
          const count = stats.stats?.[key] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const Icon = icon;

          return (
            <div
              key={key}
              className="card"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {/* top bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: color,
                borderRadius: '10px 10px 0 0'
              }} />

              {/* icon */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                color,
                fontSize: 18
              }}>
                <Icon />
              </div>

              {/* count */}
              <div style={{
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                marginBottom: 6
              }}>
                {count}
              </div>

              <div style={{
                fontSize: 13,
                color: 'var(--text-2)',
                fontWeight: 600
              }}>
                {label}
              </div>

              <div style={{
                fontSize: 12,
                color: 'var(--text-3)',
                marginTop: 4
              }}>
                {pct}% of total
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="card" style={{ marginBottom: 36 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>
              Issue Distribution
            </h3>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
              {total} total
            </span>
          </div>

          <div style={{
            display: 'flex',
            height: 10,
            borderRadius: 100,
            overflow: 'hidden',
            gap: 2
          }}>
            {STAT_CARDS.map(({ key, color }) => {
              const count = stats.stats?.[key] || 0;
              const pct = (count / total) * 100;
              if (!pct) return null;

              return (
                <div
                  key={key}
                  style={{
                    width: `${pct}%`,
                    background: color,
                    transition: 'width 0.5s ease'
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            {STAT_CARDS.map(({ key, label, color }) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: 'var(--text-2)'
                }}
              >
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: color
                }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Issues */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            Recent Issues
          </h2>
          <Link
            to="/issues"
            style={{
              fontSize: 13,
              color: 'var(--accent)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            View all
            <FaArrowAltCircleRight />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <span className="spinner" />
          </div>
        ) : issues.length === 0 ? (
          <div className="card" style={{
            textAlign: 'center',
            padding: 48,
            color: 'var(--text-3)'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>
              No issues yet
            </p>
            <p style={{ fontSize: 14 }}>
              <Link to="/issues" style={{ color: 'var(--accent)' }}>
                Create your first issue
              </Link>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {issues.slice(0, 5).map((issue) => (
              <Link
                key={issue.id}
                to={`/issues/${issue.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card"
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s'
                  }}
                  onMouseEnter={(e) =>
                    e.currentTarget.style.borderColor = 'var(--border-light)'
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      <span style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 11,
                        color: 'var(--text-3)'
                      }}>
                        #{issue.id}
                      </span>
                      <span style={{
                        fontWeight: 600,
                        fontSize: 14
                      }}>
                        {issue.title}
                      </span>
                    </div>

                    <span style={{
                      fontSize: 12,
                      color: 'var(--text-3)'
                    }}>
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}