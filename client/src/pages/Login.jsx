import Card, { CardHeader } from '../components/Card'
import Button from '../components/Button'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/apiClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (!password) return "Password is required";
    return "";
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await apiClient.post('/accounts/login/', { email, password });

      localStorage.setItem('access', res.access);
      localStorage.setItem('refresh', res.refresh);
      navigate('/dashboard')
      
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', 
      background: '#f8fafc',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem'
    }}>
      <div style={{maxWidth: '420px', width: '100%'}}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <CardHeader title="Welcome Back" eyebrow="WELCOME" />
          <p style={{marginBottom: '1rem', color: '#6b7280', fontSize: '14px'}}>Login to TechLens</p>
          
          {error && (
            <div style={{
              background: '#fee2e2', 
              color: '#b91c1c', 
              padding: '10px', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div>
              <label style={{fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px'}}>Email</label>
              <input 
                type="email" 
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', outline: 'none', color: '#111', background: 'white'}}
              />
            </div>
            
            <div>
              <label style={{fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px'}}>Password</label>
              <input 
                type="password" 
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', outline: 'none', color: '#111', background: 'white'}}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#9ca3af' : '#4f46e5', 
                marginTop: '8px',
                color: 'white',
                border: 'none',
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{display: 'flex', alignItems: 'center', gap: '16px', margin: '20px'}}>
            <div style={{flex: 1, height: '1px', background: '#e5e7eb'}}></div>
            <span style={{fontSize: '12px', color: '#9ca3af'}}>OR</span>
            <div style={{flex: 1, height: '1px', background: '#e5e7eb'}}></div>
          </div>

          <p style={{marginTop: '0', fontSize: '14px', textAlign: 'center', color: '#6b7280'}}>
            No account? <Link to="/register" style={{color: '#4f46e5', fontWeight: 600}}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}