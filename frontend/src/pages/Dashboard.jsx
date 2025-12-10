import { useCallback, useEffect, useState } from 'react'
import DashboardNav from '../components/dashboard/DashboardNav'
import AddExpenseForm from '../components/dashboard/AddExpenseForm'
import AddIncomeForm from '../components/dashboard/AddIncomeForm'
import Activity from '../components/dashboard/Activity'
import Transactions from '../components/dashboard/Transactions'
import styles from './dashboard.module.css'


const MONTH_MAP = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
};


function Dashboard() {
    const [activeMonth, setActiveMonth] = useState('Jan')
    const [activeTab, setActiveTab] = useState('dashboard')
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user?.id
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI;

    const [balanceData, setBalanceData] = useState(0)
    useEffect(() => {
        if (!activeMonth) return;

        const monthNum = MONTH_MAP[activeMonth];
        const year = new Date().getFullYear();

        fetch(`${apiBaseUrl}/api/balance/monthlyBalance?userId=${userId}&month=${monthNum}&year=${year}`)
            .then(res => res.json())
            .then(data => setBalanceData(data));

        console.log(balanceData)
    }, [activeMonth, apiBaseUrl, userId]);


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

    const [expenseList, setExpenseList] = useState([])
    const handleAddExpense = async (formData) => {
        // Placeholder: wire to backend or state store when ready
        try {
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                userId: userId, // REQUIRED so backend knows who is adding income
            }

            const response = await fetch(`${apiBaseUrl}/api/expense/addExpense`, {
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
            setExpenseList(prev => [...prev, data])

            console.log("Expense Added:", data)

        } catch (error) {
            console.error("Add Expense Error:", error.message)
        }
    }

      const NAME = localStorage.getItem('name')
      const recentTransactions = expenseList
        .filter((txn) => {
            if (!txn?.date) return false
            const txnDate = new Date(txn.date)
            if (Number.isNaN(txnDate)) return false
            return (txnDate.getMonth() + 1) === MONTH_MAP[activeMonth]
        })
        .slice(-5)
        .reverse()
      return (
        <div className={styles.dashboardShell}>
          <DashboardNav activeMonth={activeMonth} onSelectMonth={setActiveMonth} />

          <main className={styles.main}>
            <div className={styles.topBar}>
              <div className={styles.navButtons}>
                <button
                  type="button"
                  className={`${styles.navButton} ${activeTab === 'dashboard' ? styles.navActive : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <span className={styles.navLabel}>Dashboard</span>
                </button>
                <button
                  type="button"
                  className={`${styles.navButton} ${activeTab === 'activity' ? styles.navActive : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  <span className={styles.navLabel}>Activity</span>
                </button>
                <button
                  type="button"
                  className={`${styles.navButton} ${activeTab === 'ai assistant' ? styles.navActive : ''}`}
                  onClick={() => setActiveTab('ai assistant')}
                >
                  <span className={styles.navLabel}>AI Assistant</span>
                </button>
              </div>

              <div className={styles.datePill}>
                <strong>Hello, {NAME}</strong>
              </div>
            </div>

            {activeTab === 'activity' ? (
              <Activity />
            ) : (
              <>
                <div className={styles.primaryGrid}>
                  <AddIncomeForm onSubmit={handleAddIncome} />
                  <AddExpenseForm onSubmit={handleAddExpense} />
                  <Transactions
                      userId={userId}
                      year={new Date().getFullYear()}
                      activeMonth={activeMonth}
                  />
                </div>

                <div className={styles.grid}>
                  <div className={`${styles.tile} ${styles.balanceCard}`}>
                    <div className={styles.tileHeader}>
                      <div>
                        <div className={styles.kicker}>Overview</div>
                        <div className={styles.tileTitle}>Your {activeMonth} snapshot</div>
                      </div>
                    </div>
                    <div className={styles.balanceAmount}>${balanceData?.finalBalance || 0}</div>
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
              </>
            )}
          </main>
        </div>
      )
}

export default Dashboard
