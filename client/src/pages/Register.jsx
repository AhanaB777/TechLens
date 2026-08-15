import { Link, useNavigate } from 'react-router-dom'
import Card, { CardHeader } from '../components/Card'
import Button from '../components/Button'
import { useState } from 'react'

const API_URL = 'http://127.0.0.1:8000/api/accounts'

export default function Register() {
  const [step, setStep] = useState(1) // 1 = enter details, 2 = enter OTP
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!name.trim()) return "Name is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (!passwordRegex.test(password)) return "Password must be at least 6 characters and include 1 letter + 1 number";
    return "";
  }

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        setStep(2); // move to OTP screen
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError("Server error. Is Django running?");
    } finally {
      setLoading(false);
    }
  }

  // STEP 2: Verify OTP + Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp) return setError("OTP is required");
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/verify-otp-and-register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, otp })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        alert('Registration successful! Please login.');
        navigate('/login'); // go to login after register
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError("Server error. Is Django running?");
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
          <CardHeader title={step === 1 ? "Create Account" : "Verify OTP"} eyebrow="WELCOME" />
          <p style={{marginBottom: '1rem', color: '#6b7280', fontSize: '14px'}}>
            {step === 1 ? "Join TechLens today" : `OTP sent to ${email}. Check your gmail.`}
          </p>
          
          {error && (
            <div style={{background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px'}}>
              {error}
            </div>
          )}
          {message && (
            <div style={{background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px'}}>
              {message}
            </div>
          )}

          {/* STEP 1 FORM */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px'}}>Name</label>
                <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} style={{padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', outline: 'none', color: '#111', background: 'white'}}/>
              </div>
              <div>
                <label style={{fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px'}}>Email</label>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={{padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', outline: 'none', color: '#111', background: 'white'}}/>
              </div>
              <div>
                <label style={{fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px'}}>Password</label>
                <input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} style={{padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', outline: 'none', color: '#111', background: 'white'}}/>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {/* STEP 2 FORM */}
          {step === 2 && (
            <form onSubmit={handleVerifyAndRegister} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px'}}>Enter 6-digit OTP</label>
                <input type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} style={{padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', outline: 'none', color: '#111', background: 'white', letterSpacing: '2px'}}/>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </Button>
              <button type="button" onClick={handleSendOtp} style={{background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '14px'}}>
                Resend OTP
              </button>
            </form>
          )}

          <div style={{display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0'}}>
            <div style={{flex: 1, height: '1px', background: '#e5e7eb'}}></div>
            <span style={{fontSize: '12px', color: '#9ca3af'}}>OR</span>
            <div style={{flex: 1, height: '1px', background: '#e5e7eb'}}></div>
          </div>

          <p style={{marginTop: '0', fontSize: '14px', textAlign: 'center', color: '#6b7280'}}>
            Already have an account? <Link to="/login" style={{color: '#4f46e5', fontWeight: 600, textDecoration: 'none'}}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}