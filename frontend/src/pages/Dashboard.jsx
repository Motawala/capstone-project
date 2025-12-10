import { useCallback, useState } from 'react'
import DashboardNav from '../components/dashboard/DashboardNav'
import AddExpenseForm from '../components/dashboard/AddExpenseForm'
import AddIncomeForm from '../components/dashboard/AddIncomeForm'
import styles from './dashboard.module.css'

function Dashboard() {
    const [activeMonth, setActiveMonth] = useState('Jan')
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user?.id
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI;

    const [incomeList, setIncomeList] = useState([])
    const handleAddIncome = async (formData) => {
        try {
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                userId: userId, // REQUIRED so backend knows who is adding income
            }

            const response = await fetch(`${apiBaseUrl}/api/income/addIncome`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to add income")
            }

            // Update UI instantly
            setIncomeList(prev => [...prev, data])

            console.log("Income Added:", data)

        } catch (error) {
            console.error("Add Income Error:", error.message)
        }
    }


    const handleAddExpense = useCallback((expense) => {
        // Placeholder: wire to backend or state store when ready
        console.log('Expense submitted:', expense)
    }, [])

      const NAME = localStorage.getItem('name')
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
                <strong>Hello, {NAME}</strong>
              </div>
            </div>

            <div className={styles.primaryGrid}>
              <AddIncomeForm onSubmit={handleAddIncome} />
              <AddExpenseForm onSubmit={handleAddExpense} />
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
            </div>

            <div className={styles.grid}>
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
