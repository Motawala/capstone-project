import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from '../../pages/dashboard.module.css'

function Transactions({ userId, activeMonth, year, refreshToken }) {
    const [transactions, setTransactions] = useState([])
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI

    // Convert month name → number
    const monthNumber = new Date(`${activeMonth} 1, ${year}`).getMonth() + 1

    useEffect(() => {
        if (!userId) return

        const fetchTransactions = async () => {
            try {
                const res = await fetch(
                    `${apiBaseUrl}/api/transactions/monthlyTransactions?userId=${userId}&month=${monthNumber}&year=${year}`
                )

                const data = await res.json()

                // Ensure sorted by date ASC
                const sorted = (data.transactions || []).sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                )

                setTransactions(sorted)
            } catch (err) {
                console.error("Transaction fetch error:", err)
            }
        }

        fetchTransactions()
    }, [userId, activeMonth, year, refreshToken])

    const handleDelete = async (id) => {
        try {
            // Optimistically remove
            setTransactions((prev) => prev.filter((t) => t._id !== id))

            await fetch(`${apiBaseUrl}/api/transactions/${id}`, {
                method: 'DELETE',
            })
        } catch (err) {
            console.error('Delete transaction error:', err)
        }
    }

    return (
        <div className={`${styles.tile} ${styles.recentCard}`}>
            <div className={styles.tileHeader}>
                <div>
                    <div className={styles.kicker}>This month</div>
                    <div className={styles.tileTitle}>Recent transactions</div>
                </div>
            </div>

            {transactions.length === 0 ? (
                <div className={styles.tileSubtitle}>No transactions yet for this month.</div>
            ) : (
                <ul className={styles.txnList}>
                    {transactions.map((txn) => {
                        const dateLabel = new Date(txn.date).toLocaleDateString()
                        const label = txn.category || txn.source || txn.description || "Transaction"

                        // Amount color: green for incomes, red for expenses
                        const amountStyle = {
                            color: txn.type === "income" ? "#22c55e" : "#ef4444",
                            fontWeight: 700,
                        }

                        return (
                            <li key={txn._id} className={styles.txnRow}>
                                <div className={styles.txnMeta}>
                                    <span className={styles.txnLabel}>{label}</span>
                                    <span className={styles.txnDate}>{dateLabel}</span>
                                </div>

                                <div className={styles.txnActions}>
                                    <span className={styles.txnAmount} style={amountStyle}>
                                      {txn.type === "income" ? "+" : "-"}${Number(txn.amount).toFixed(2)}
                                    </span>
                                    <button
                                      type="button"
                                      className={styles.txnDelete}
                                      onClick={() => handleDelete(txn._id)}
                                      aria-label={`Delete transaction ${label}`}
                                    >
                                      Delete
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

Transactions.propTypes = {
    userId: PropTypes.string.isRequired,
    activeMonth: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    refreshToken: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default Transactions
