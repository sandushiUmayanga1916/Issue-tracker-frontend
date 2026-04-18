import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

import { MdDashboard } from 'react-icons/md';
import { PiListDashesFill } from 'react-icons/pi';

import logo from '../assets/fav.png';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: MdDashboard  },
  { to: '/issues', label: 'Issues', icon: PiListDashesFill },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 10,
      }}>

        {/* Logo */}
        <div style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={logo}
              alt="TrackFlow Logo"
              style={{
                width: 40,
                height: 'auto',
                marginBottom: 10,
              }}
            />
            <span style={{
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: '-0.02em'
            }}>
              TrackFlow
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          {NAV.map(({ to, label, icon }) => {
            const Icon = icon;

            return (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: isActive ? 'var(--text)' : 'var(--text-2)',
                  background: isActive ? 'var(--surface-3)' : 'transparent',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                })}
              >
                <span style={{ fontSize: 16 }}>
                  <Icon />
                </span>
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.name}
            </div>

            <div style={{
              fontSize: 11,
              color: 'var(--text-3)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.email}
            </div>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
            style={{
              width: '100%',
              justifyContent: 'center'
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1,
        marginLeft: 220,
        minHeight: '100vh',
        background: 'var(--bg)'
      }}>
        <Outlet />
      </main>
    </div>
  );
}