import { useCallback, useEffect, useState } from 'react'
import DashboardNav from '../components/dashboard/DashboardNav'
import AddExpenseForm from '../components/dashboard/AddExpenseForm'
import AddIncomeForm from '../components/dashboard/AddIncomeForm'
import Activity from '../components/dashboard/Activity'
import Transactions from '../components/dashboard/Transactions'
import AiAssistant from '../components/assistant/AiAssistant.jsx'
import styles from './dashboard.module.css'


const MONTH_MAP = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
};


function Dashboard() {
    const MONTH_NAMES = Object.keys(MONTH_MAP);
    const currentMonthName = MONTH_NAMES[new Date().getMonth()];

    const [activeMonth, setActiveMonth] = useState(currentMonthName);
    const [activeTab, setActiveTab] = useState('dashboard')
    const [successInfo, setSuccessInfo] = useState(null)
    const [refreshToken, setRefreshToken] = useState(0)
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user?.id
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI;

    const [balanceData, setBalanceData] = useState(0)
    const fetchBalance = useCallback(() => {
        if (!activeMonth) return;

        const monthNum = MONTH_MAP[activeMonth];
        const year = new Date().getFullYear();

        fetch(`${apiBaseUrl}/api/balance/monthlyBalance?userId=${userId}&month=${monthNum}&year=${year}`)
            .then(res => res.json())
            .then(data => setBalanceData(data))
            .catch((err) => console.error('Balance fetch error:', err));
    }, [activeMonth, apiBaseUrl, userId])

    useEffect(() => {
        fetchBalance()
    }, [fetchBalance]);

    const triggerRefresh = useCallback(() => {
        setRefreshToken(Date.now())
        fetchBalance()
    }, [fetchBalance])


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
            setSuccessInfo({ type: 'income', message: 'Income added successfully' })
            triggerRefresh()
            setTimeout(() => setSuccessInfo(null), 3000)

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
            setSuccessInfo({ type: 'expense', message: 'Expense added successfully' })
            triggerRefresh()
            setTimeout(() => setSuccessInfo(null), 3000)

            console.log("Expense Added:", data)

        } catch (error) {
            console.error("Add Expense Error:", error.message)
        }
    }

      const NAME = localStorage.getItem('name')
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

                  <Activity
                      userId={userId}
                      month={MONTH_MAP[activeMonth]}
                      year={new Date().getFullYear()}
                  />

              ) : activeTab === 'ai assistant' ? (

                  <AiAssistant
                      userId={userId}
                      month={MONTH_MAP[activeMonth]}
                      year={new Date().getFullYear()}
                  />

              ) : (
              <>
                {successInfo && (
                  <div className={styles.successBanner} role="status">
                    <span className={styles.successType}>{successInfo.type === 'income' ? 'Income' : 'Expense'}</span>
                    <span>{successInfo.message}</span>
                  </div>
                )}

                <div className={styles.snapshotBar}>
                  <div className={styles.snapshotText}>
                    <div className={styles.kicker}>Overview</div>
                    <div className={styles.tileTitle}>Your {activeMonth} snapshot</div>
                  </div>
                    <div
                        className={styles.balanceAmount}
                        style={{
                            color: (balanceData?.finalBalance ?? 0) >= 0 ? "#22c55e" : "#ef4444"
                        }}
                    >
                        {(balanceData?.finalBalance ?? 0) >= 0
                            ? `+$${(balanceData?.finalBalance ?? 0).toLocaleString()}`
                            : `-$${Math.abs(balanceData?.finalBalance ?? 0).toLocaleString()}`
                        }
                    </div>
                </div>

                <div className={styles.primaryGrid}>
                  <AddIncomeForm onSubmit={handleAddIncome} />
                  <AddExpenseForm onSubmit={handleAddExpense} />
                  <Transactions
                      userId={userId}
                      year={new Date().getFullYear()}
                      activeMonth={activeMonth}
                      refreshToken={refreshToken}
                      onChange={triggerRefresh}
                  />
                </div>

              </>
            )}
          </main>
        </div>
      )
}

export default Dashboard
