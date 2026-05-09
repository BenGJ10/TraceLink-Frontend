import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { register as registerApi } from '../api/endpoints'
import { Wordmark } from '../components/Logo'

export default function RegisterPage() {
  const { user } = useAuth()
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
      await registerApi({ username: data.username, email: data.email, password: data.password, role: ['ROLE_USER'] })
      toast.success('Account created — sign in to continue')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data
      toast.error(typeof msg === 'string' ? msg : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-logo">
          <Link to="/">
            <Wordmark size={32} />
          </Link>
        </div>

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-sub">Free forever — no credit card required</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label className="field-label" htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              className={`input${errors.username ? ' is-error' : ''}`}
              placeholder="john_doe"
              autoComplete="username"
              {...register('username', {
                required: 'Required',
                minLength: { value: 3, message: 'Min 3 characters' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, underscores only' },
              })}
            />
            {errors.username && <span className="field-error">{errors.username.message}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className={`input${errors.email ? ' is-error' : ''}`}
              placeholder="john@example.com"
              autoComplete="email"
              {...register('email', {
                required: 'Required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                className={`input${errors.password ? ' is-error' : ''}`}
                style={{ paddingRight: 40 }}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
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
            id="register-submit"
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: 4, padding: '10px 16px', fontSize: 14, fontWeight: 600, justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Create account'}
          </button>
        </form>

        <div className="divider-or" style={{ margin: '20px 0' }}>or</div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
