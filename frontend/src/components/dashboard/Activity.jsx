import styles from '../../pages/dashboard.module.css'

const placeholderCards = [
  { title: 'Spending by Category', hint: 'Insert bar/column chart here.' },
  { title: 'Income vs Expense Trend', hint: 'Line graph placeholder.' },
  { title: 'Payment Methods Split', hint: 'Pie or donut chart area.' },
  { title: 'Alerts & Insights', hint: 'Callouts for anomalies or tips.' },
]

function Activity() {
  return (
    <div className={styles.activityGrid}>
      {placeholderCards.map((card) => (
        <div key={card.title} className={`${styles.tile} ${styles.activityCard}`}>
          <h4 className={styles.activityHeader}>{card.title}</h4>
          <p className={styles.activityHint}>{card.hint}</p>
        </div>
      ))}
    </div>
  )
}

export default Activity
