import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api' });

function saveSession(data) {
  localStorage.setItem('campusconnect_token', data.token);
  localStorage.setItem('campusconnect_user', JSON.stringify(data.user));
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('campusconnect_user') ?? 'null');
  } catch {
    return null;
  }
}

function AppLayout({ user, onLogout, children }) {
  return (
    <div className="site">
      <header className="topbar">
        <Link className="brand" to="/">Campus<span>Connect</span></Link>
        <nav>
          <Link to="/donations">Donations</Link>
          <Link to="/lost-found">Lost &amp; Found</Link>
          <Link to="/volunteer">Volunteer</Link>
          <Link to="/events">Events</Link>
          <Link to="/announcements">Announcements</Link>
        </nav>
        <div className="account">
          {user ? <><Link className="account-link" to="/dashboard">{user.name}</Link><button className="button ghost" onClick={onLogout}>Log out</button></> : <Link className="button" to="/login">Sign in</Link>}
        </div>
      </header>
      {children}
    </div>
  );
}

function Home() {
  const features = [
    ['Ask for support', 'Create a moderated donation request when you or someone you know needs help.', '/donations'],
    ['Find what is missing', 'Report lost and found items safely across campus.', '/lost-found'],
    ['Give your time', 'Discover meaningful volunteer opportunities and campus events.', '/volunteer']
  ];
  return <main>
    <section className="hero">
      <div><p className="eyebrow">Your campus, connected</p><h1>Small acts make a stronger university.</h1><p className="lead">CampusConnect brings support, volunteering, activities, and campus life into one trusted community.</p><div className="actions"><Link className="button" to="/register">Join the community</Link><Link className="button secondary" to="/events">Explore activities</Link></div></div>
      <div className="hero-card"><span className="hero-icon">✦</span><strong>Community first</strong><p>Built for students, faculty, societies, and everyone who makes campus better.</p></div>
    </section>
    <section className="section"><div className="section-heading"><p className="eyebrow">Get involved</p><h2>One place for campus life</h2></div><div className="feature-grid">{features.map(([title, text, path]) => <Link className="feature-card" to={path} key={title}><h3>{title}</h3><p>{text}</p><span>Explore →</span></Link>)}</div></section>
  </main>;
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', identification: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isRegister = mode === 'register';
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const { data } = await api.post(`/auth/${isRegister ? 'register' : 'login'}`, form);
      saveSession(data.data); navigate('/dashboard');
      window.location.reload();
    } catch (requestError) {
      setError(requestError.response?.data?.error?.message ?? 'Unable to connect to CampusConnect.');
    } finally { setBusy(false); }
  }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><p className="eyebrow">{isRegister ? 'Join the community' : 'Welcome back'}</p><h1>{isRegister ? 'Create your account' : 'Sign in to CampusConnect'}</h1>{error && <div className="error">{error}</div>}{isRegister && <><label>Full name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Student or staff ID<input required value={form.identification} onChange={e => setForm({ ...form, identification: e.target.value })} /></label></>}<label>University email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label>Password<input required type="password" minLength="8" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label><button className="button wide" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button><p className="switch">{isRegister ? 'Already registered?' : 'New to CampusConnect?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p></form></main>;
}

function ProtectedDashboard({ user }) {
  if (!user) return <Navigate to="/login" replace />;
  return <main className="dashboard section"><p className="eyebrow">Personal dashboard</p><h1>Welcome, {user.name}.</h1><p className="lead">Your activity, requests, applications, and notifications will appear here as you participate in campus life.</p><div className="empty-state"><h2>Your dashboard is ready</h2><p>Start by exploring an opportunity or creating a request.</p><Link className="button" to="/events">Explore campus activities</Link></div></main>;
}

function ResourcePage({ title, endpoint, collection, fields }) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  useEffect(() => {
    let active = true;
    api.get(endpoint).then(({ data }) => {
      if (active) { setItems(data.data[collection] ?? []); setState('ready'); }
    }).catch(() => { if (active) setState('error'); });
    return () => { active = false; };
  }, [endpoint, collection]);
  return <main className="section resource-page"><p className="eyebrow">CampusConnect</p><h1>{title}</h1><p className="lead">Explore current community activity shared by authenticated campus members.</p>{state === 'loading' && <div className="empty-state"><h2>Loading current activity…</h2></div>}{state === 'error' && <div className="error">The service is unavailable. Start the backend and connect MongoDB to load this module.</div>}{state === 'ready' && items.length === 0 && <div className="empty-state"><h2>No published items yet</h2><p>There is no sample content here. Check back after members publish something.</p></div>}{items.length > 0 && <div className="resource-grid">{items.map(item => <article className="resource-card" key={item._id}><h2>{item.title || item.name}</h2>{fields.map(field => item[field] && <p key={field}><strong>{field.replace(/[A-Z]/g, letter => ` ${letter}`).replace(/^./, letter => letter.toUpperCase())}:</strong> {String(item[field])}</p>)}</article>)}</div>}</main>;
}

function App() {
  const [user, setUser] = useState(getUser);
  function logout() { localStorage.removeItem('campusconnect_token'); localStorage.removeItem('campusconnect_user'); setUser(null); }
  return <AppLayout user={user} onLogout={logout}><Routes><Route path="/" element={<Home />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/dashboard" element={<ProtectedDashboard user={user} />} /><Route path="/donations" element={<ResourcePage title="Donation & community support" endpoint="/donations" collection="donations" fields={['category', 'description', 'status']} />} /><Route path="/lost-found" element={<ResourcePage title="Lost & Found" endpoint="/lost-and-found" collection="items" fields={['type', 'category', 'location', 'status']} />} /><Route path="/volunteer" element={<ResourcePage title="Volunteer opportunities" endpoint="/volunteering" collection="opportunities" fields={['category', 'venue', 'status']} />} /><Route path="/events" element={<ResourcePage title="Campus activities & events" endpoint="/events" collection="events" fields={['category', 'venue', 'status']} />} /><Route path="/announcements" element={<ResourcePage title="Campus announcements" endpoint="/announcements" collection="announcements" fields={['category', 'body']} />} /></Routes></AppLayout>;
}

createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
