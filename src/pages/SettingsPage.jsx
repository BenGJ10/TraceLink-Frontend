import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getProfile, updateUsername, updatePassword, deleteAccount } from '../api/endpoints'
import { useNavigate } from 'react-router-dom'

const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const LockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>

export default function SettingsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const { register: regUser, handleSubmit: handleUser, formState: { errors: errUser } } = useForm()
  const { register: regPass, handleSubmit: handlePass, reset: resetPass, formState: { errors: errPass } } = useForm()

  const [pendingUsername, setPendingUsername] = useState(null)
  const [pendingPassword, setPendingPassword] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    getProfile()
      .then(res => setProfile(res.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const onUpdateUsername = async () => {
    try {
      await updateUsername({ newUsername: pendingUsername.newUsername })
      setProfile(prev => ({ ...prev, username: pendingUsername.newUsername }))
      toast.success('Username updated successfully. Please sign in again.')
      setPendingUsername(null)
      logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update username')
      setPendingUsername(null)
    }
  }

  const onUpdatePassword = async () => {
    try {
      await updatePassword({
        currentPassword: pendingPassword.currentPassword,
        newPassword: pendingPassword.newPassword
      })
      toast.success('Password updated successfully')
      resetPass()
      setPendingPassword(null)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password')
      setPendingPassword(null)
    }
  }

  const onDeleteAccount = async () => {
    try {
      await deleteAccount()
      toast.success('Account deleted successfully')
      logout()
      navigate('/')
    } catch {
      toast.error('Failed to delete account')
    }
  }

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div className="spinner spinner-lg" />
      </div>
    )
  }

  return (
    <div className="page page-enter">
      <div className="page-header" style={{ marginBottom: 40 }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-desc">Manage your account preferences and security.</p>
      </div>

      {/* Account Info */}
      <div style={{ display: 'flex', gap: 48, borderBottom: '1px solid var(--border)', paddingBottom: 40, marginBottom: 40 }}>
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, background: 'var(--blue-50)', color: 'var(--blue-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Profile Details</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Update your username and view your account information. Your current email address is <strong style={{ color: 'var(--text-primary)' }}>{profile?.email}</strong>.
          </p>
        </div>

        <div className="card" style={{ flex: 1, padding: 32 }}>
          <form onSubmit={handleUser(data => setPendingUsername(data))} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="field">
              <label className="field-label">Username</label>
              <input
                className={`input${errUser.newUsername ? ' is-error' : ''}`}
                style={{ maxWidth: 400 }}
                defaultValue={profile?.username}
                {...regUser('newUsername', { required: 'Username is required', minLength: { value: 3, message: 'Minimum 3 characters' } })}
              />
              {errUser.newUsername && <span className="field-error">{errUser.newUsername.message}</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>Save Username</button>
            </div>
          </form>
        </div>
      </div>

      {/* Security */}
      <div style={{ display: 'flex', gap: 48, borderBottom: '1px solid var(--border)', paddingBottom: 40, marginBottom: 40 }}>
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gray-100)', color: 'var(--gray-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockIcon />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Change Password</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        <div className="card" style={{ flex: 1, padding: 32 }}>
          <form onSubmit={handlePass(data => setPendingPassword(data))} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="field">
              <label className="field-label">Current Password</label>
              <input type="password"
                className={`input${errPass.currentPassword ? ' is-error' : ''}`}
                style={{ maxWidth: 400 }}
                {...regPass('currentPassword', { required: 'Current password is required' })}
              />
              {errPass.currentPassword && <span className="field-error">{errPass.currentPassword.message}</span>}
            </div>
            <div className="field">
              <label className="field-label">New Password</label>
              <input type="password"
                className={`input${errPass.newPassword ? ' is-error' : ''}`}
                style={{ maxWidth: 400 }}
                {...regPass('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              />
              {errPass.newPassword && <span className="field-error">{errPass.newPassword.message}</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
              <button type="submit" className="btn btn-secondary" style={{ padding: '8px 20px' }}>Update Password</button>
            </div>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ display: 'flex', gap: 48 }}>
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrashIcon />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#b91c1c' }}>Danger Zone</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Permanently delete your account and all associated URLs and analytics. This action is irreversible.
          </p>
        </div>

        <div className="card" style={{ flex: 1, padding: 32, border: '1px solid #fca5a5' }}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px 0' }}>Delete Account</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="btn btn-danger" style={{ padding: '8px 24px' }} onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </button>
        </div>
      </div>

      {/* Modals */}
      {pendingUsername && (
        <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setPendingUsername(null)}>
          <div className="modal" style={{ width: 400 }}>
            <h2 className="modal-title" style={{ marginBottom: 8 }}>Update Username?</h2>
            <p className="modal-desc" style={{ marginBottom: 24 }}>Are you sure you want to change your username? You will be signed out and prompted to sign in again.</p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setPendingUsername(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={onUpdateUsername}>Confirm Change</button>
            </div>
          </div>
        </div>
      )}

      {pendingPassword && (
        <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setPendingPassword(null)}>
          <div className="modal" style={{ width: 400 }}>
            <h2 className="modal-title" style={{ marginBottom: 8 }}>Update Password?</h2>
            <p className="modal-desc" style={{ marginBottom: 24 }}>Are you sure you want to update your password? You will use the new password on your next sign in.</p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setPendingPassword(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={onUpdatePassword}>Confirm Update</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setShowDeleteConfirm(false)}>
          <div className="modal" style={{ width: 400 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                <TrashIcon />
              </div>
              <div>
                <h2 className="modal-title" style={{ marginBottom: 2 }}>Delete Account?</h2>
                <p className="modal-desc" style={{ margin: 0 }}>This action cannot be undone.</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
              All of your shortened URLs, analytics data, and account details will be permanently removed.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={onDeleteAccount}>
                Yes, delete my account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
