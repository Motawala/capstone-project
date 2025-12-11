import CategoryPieChart from "../activity/CategoryPieChart.jsx";
import IncomeExpenseLineChart from "../activity/IncomeExpenseLineChart.jsx";
import SpendingHeatmap from "../activity/SpendingHeatmap.jsx";
import DailyCashflowAreaChart from "../activity/DailyCashflowAreaChart.jsx";
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
                <h4 className={styles.activityHeader}>Spending Heatmap</h4>
                <SpendingHeatmap
                    userId={userId}
                    month={month}
                    year={year}
                />
            </div>

            <div className={`${styles.tile} ${styles.activityCard}`}>
                <h4 className={styles.activityHeader}>Daily Cash Flow</h4>
                <DailyCashflowAreaChart
                    userId={userId}
                    month={month}
                    year={year}
                />
            </div>
        </div>
    );
}

export default Activity;
