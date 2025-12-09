import { useCallback, useState } from 'react'
import DashboardNav from '../components/dashboard/DashboardNav'
import AddExpenseForm from '../components/dashboard/AddExpenseForm'
import styles from './dashboard.module.css'

function Dashboard() {
  const [activeMonth, setActiveMonth] = useState('Jan')

  const handleAddExpense = useCallback((expense) => {
    // Placeholder: wire to backend or state store when ready
    console.log('Expense submitted:', expense)
  }, [])

  return (
    <div className={styles.dashboardShell}>
      <DashboardNav activeMonth={activeMonth} onSelectMonth={setActiveMonth} />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.navButtons}>
            <span className={`${styles.navButton} ${styles.navActive}`}>
              <span className={styles.navLabel}>Dashboard</span>
            </span>
            <span className={styles.navButton}>
              <span className={styles.navLabel}>Activity</span>
            </span>
            <span className={styles.navButton}>
              <span className={styles.navLabel}>Trends</span>
            </span>
          </div>

          <div className={styles.datePill}>
            <span className={styles.navLabel}>Active month</span>
            <strong>{activeMonth}</strong>
          </div>
        </div>

        <AddExpenseForm onSubmit={handleAddExpense} />

        <div className={styles.grid}>
          <div className={`${styles.tile} ${styles.balanceCard}`}>
            <div className={styles.tileHeader}>
              <div>
                <div className={styles.kicker}>Overview</div>
                <div className={styles.tileTitle}>Your {activeMonth} snapshot</div>
              </div>
            </div>
            <div className={styles.balanceAmount}>$12,400</div>
            <div className={styles.balanceSub}>Select a month to keep tracking your spending.</div>
          </div>

          <div className={styles.tile}>
            <div className={styles.tileHeader}>
              <div>
                <div className={styles.kicker}>Status</div>
                <div className={styles.tileTitle}>Coming soon</div>
              </div>
            </div>
            <div className={styles.tileSubtitle}>
              More dashboard insights will appear here. For now, use the navigation bar to pick a month
              and log out when you are done.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
