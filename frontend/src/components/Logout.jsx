import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded'
import styles from './logout.module.css'

function Logout({ className = '' }) {
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    try {
      googleLogout()
    } catch (error) {
      console.error('Google logout failed', error)
    }

    localStorage.removeItem('credentialToken')
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <button
      type="button"
      className={`${styles.logoutButton} ${className}`.trim()}
      onClick={handleLogout}
      title="Logout"
      aria-label="Logout"
    >
      <span className={styles.icon} aria-hidden>
        <PowerSettingsNewRoundedIcon fontSize="small" />
      </span>
      <span className={styles.label}>Logout</span>
    </button>
  )
}

export default Logout
