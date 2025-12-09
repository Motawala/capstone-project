import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Button, MenuItem, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import styles from '../../pages/dashboard.module.css'

const categoryOptions = ['Housing', 'Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Travel', 'Utilities', 'Other']
const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Bank Transfer']

function AddExpenseForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: dayjs(),
    description: '',
    category: '',
    paymentMethod: '',
    amount: '',
  })

  const textFieldStyles = useMemo(
    () => ({
      variant: 'outlined',
      color: 'info',
      size: 'small',
      required: true,
      fullWidth: true,
      InputLabelProps: { sx: { color: '#94a3b8', '&.Mui-focused': { color: '#22d3ee' } } },
      sx: {
        backgroundColor: '#0d1326',
        borderRadius: '12px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          color: '#e2e8f0',
          backgroundColor: '#0d1326',
          '& fieldset': {
            borderColor: '#22d3ee',
          },
          '&:hover fieldset': {
            borderColor: '#22d3ee',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#22d3ee',
            boxShadow: '0 0 0 2px rgba(34, 211, 238, 0.25)',
          },
        },
        '& .MuiSvgIcon-root': {
          color: '#22d3ee',
        },
      },
    }),
    []
  )

  const handleChange = (field) => (event) => {
    const value = event?.target?.value ?? ''
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateChange = (value) => {
    setFormData((prev) => ({ ...prev, date: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (typeof onSubmit === 'function') {
      onSubmit({
        ...formData,
        date: formData.date ? formData.date.toISOString() : null,
      })
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form className={styles.addExpenseCard} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <h3 className={styles.formTitle}>Add Expenses</h3>
          <p className={styles.formHint}>Log a new expense to keep your {formData.date?.format('MMM') || 'month'} on track.</p>
        </div>

        <div className={styles.formRow}>
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                ...textFieldStyles,
                InputLabelProps: { ...textFieldStyles.InputLabelProps, shrink: true },
              },
            }}
          />

          <TextField
            label="Expense Desc"
            value={formData.description}
            onChange={handleChange('description')}
            {...textFieldStyles}
          />

          <TextField
            select
            label="Category"
            value={formData.category}
            onChange={handleChange('category')}
            {...textFieldStyles}
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={handleChange('paymentMethod')}
            {...textFieldStyles}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={formData.amount}
            onChange={handleChange('amount')}
            {...textFieldStyles}
          />
        </div>

        <div className={styles.formActions}>
          <Button type="submit" variant="contained" color="info" size="large">
            Save Expense
          </Button>
        </div>
      </form>
    </LocalizationProvider>
  )
}

AddExpenseForm.propTypes = {
  onSubmit: PropTypes.func,
}

export default AddExpenseForm
