import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../api/endpoints'
import { Wordmark } from '../components/Logo'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await loginApi({ username: data.username, password: data.password })
      login(res.data.token, data.username)
      toast.success('Signed in')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        {/* Logo */}
        <div className="auth-logo">
          <Link to="/">
            <Wordmark size={32} />
          </Link>
        </div>

        <h1 className="auth-heading">Sign in</h1>
        <p className="auth-sub">Enter your credentials to access the dashboard</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label className="field-label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              className={`input${errors.username ? ' is-error' : ''}`}
              placeholder="your_username"
              autoComplete="username"
              {...register('username', { required: 'Required' })}
            />
            {errors.username && <span className="field-error">{errors.username.message}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className={`input${errors.password ? ' is-error' : ''}`}
                style={{ paddingRight: 40 }}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500 }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: 4, padding: '10px 16px', fontSize: 14, fontWeight: 600, justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Sign in'}
          </button>
        </form>

        <div className="divider-or" style={{ margin: '20px 0' }}>or</div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
