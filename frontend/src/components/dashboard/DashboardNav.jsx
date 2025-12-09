import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import Logout from '../Logout'
import styles from './dashboardNav.module.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function DashboardNav({ activeMonth = 'Jan', onSelectMonth }) {
  const handleMonthClick = (month) => {
    if (typeof onSelectMonth === 'function') {
      onSelectMonth(month)
    }
  }
  const profileImageURL = localStorage.getItem('picture')
  return (
    <nav className={styles.navbar} aria-label="Dashboard navigation">
      <div className={styles.account} aria-label="Account">
          <img
              src={profileImageURL}
              alt="User profile"
              className={styles.profileImage}
          />
      </div>

      <div className={styles.monthSection}>
        <p className={styles.monthLabel}>Months</p>
        <div className={styles.monthList} role="list">
          {MONTHS.map((month) => (
            <button
              key={month}
              type="button"
              className={`${styles.monthButton} ${activeMonth === month ? styles.active : ''}`.trim()}
              onClick={() => handleMonthClick(month)}
              aria-pressed={activeMonth === month}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.logoutWrap}>
        <Logout />
      </div>
    </nav>
  )
}

export default DashboardNav
