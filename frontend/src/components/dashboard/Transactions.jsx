import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from '../../pages/dashboard.module.css'

function Transactions({ userId, activeMonth, year, refreshToken, onChange }) {
    const [transactions, setTransactions] = useState([])
    const apiBaseUrl = import.meta.env.VITE_BACKEND_URI

    const [confirmDelete, setConfirmDelete] = useState(null)   // selected transaction
    const [toast, setToast] = useState(null)                  // toast message
    const [reloadNonce, setReloadNonce] = useState(0)         // trigger refresh after delete

    // Convert month name → number
    const monthNumber = new Date(`${activeMonth} 1, ${year}`).getMonth() + 1

    // Fetch transactions
    useEffect(() => {
        if (!userId) return

        const fetchTransactions = async () => {
            try {
                const res = await fetch(
                    `${apiBaseUrl}/api/transactions/monthlyTransactions?userId=${userId}&month=${monthNumber}&year=${year}`
                )

                const data = await res.json()

                const sorted = (data.transactions || []).sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                )

                setTransactions(sorted)
            } catch (err) {
                console.error("Transaction fetch error:", err)
            }
        }

        fetchTransactions()
    }, [userId, activeMonth, year, refreshToken, reloadNonce])

    // Delete handler after confirmation
    const handleDeleteConfirmed = async () => {
        if (!confirmDelete) return

        const id = confirmDelete._id

        try {
            // Remove from UI immediately
            setTransactions(prev => prev.filter(t => t._id !== id))

            const res = await fetch(
                `${apiBaseUrl}/api/transactions/deleteTransaction?userId=${userId}&transactionId=${id}`,
                { method: "DELETE" }
            )

            const data = await res.json()

            if (res.ok) {
                setToast({
                    message: `${data.type === "income" ? "Income" : "Expense"} deleted`,
                    type: "success"
                })
                onChange?.()
            } else {
                setToast({ message: data.message || "Delete failed", type: "error" })
            }

        } catch (err) {
            console.error("Delete transaction error:", err)
            setToast({ message: "Server error deleting transaction", type: "error" })
        } finally {
            setConfirmDelete(null)
            setReloadNonce((n) => n + 1) // silently refresh data from server
            setTimeout(() => setToast(null), 2500)
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

            {/* ---------------------- TOAST NOTIFICATION ---------------------- */}
            {toast && (
                <div
                    className={`${styles.toast} ${
                        toast.type === "success" ? styles.toastSuccess : styles.toastError
                    }`}
                    role="status"
                >
                    {toast.message}
                </div>
            )}

            {transactions.length === 0 ? (
                <div className={styles.tileSubtitle}>No transactions yet for this month.</div>
            ) : (
                <ul className={styles.txnList}>
                    {transactions.map((txn) => {
                        const dateLabel = new Date(txn.date).toLocaleDateString()
                        const label = txn.category || txn.source || txn.description || "Transaction"

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
                                        onClick={() => setConfirmDelete(txn)}
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

            {/* ---------------------- CONFIRMATION MODAL ---------------------- */}
            {confirmDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Delete Transaction?</h3>
                        <p>
                            Are you sure you want to delete <strong>{confirmDelete.category}</strong>{" "}
                            for <strong>${confirmDelete.amount}</strong>?
                        </p>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.modalCancel}
                                onClick={() => setConfirmDelete(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className={styles.modalDelete}
                                onClick={handleDeleteConfirmed}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

Transactions.propTypes = {
    userId: PropTypes.string.isRequired,
    activeMonth: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    refreshToken: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
}

export default Transactions
