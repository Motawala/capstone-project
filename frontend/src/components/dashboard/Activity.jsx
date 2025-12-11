import CategoryPieChart from "../activity/CategoryPieChart.jsx";
import IncomeExpenseLineChart from "../activity/IncomeExpenseLineChart.jsx";
import styles from "../../pages/dashboard.module.css";

function Activity({ userId, month, year }) {
    return (
        <div className={styles.activityGrid}>
            <div className={`${styles.tile} ${styles.activityCard}`}>
                <h4 className={styles.activityHeader}>Spending by Category</h4>
                <CategoryPieChart userId={userId} month={month} year={year} />
            </div>

            <div className={`${styles.tile} ${styles.activityCard}`}>
                <h4 className={styles.activityHeader}>Income vs Expense Trend</h4>
                <IncomeExpenseLineChart userId={userId} month={month} year={year} />
            </div>

            <div className={`${styles.tile} ${styles.activityCard}`}>
                <h4 className={styles.activityHeader}>Payment Methods Split</h4>
                <p className={styles.activityHint}>Pie or donut chart area.</p>
            </div>

            <div className={`${styles.tile} ${styles.activityCard}`}>
                <h4 className={styles.activityHeader}>Alerts & Insights</h4>
                <p className={styles.activityHint}>Tips & anomaly detection coming soon.</p>
            </div>
        </div>
    );
}

export default Activity;
