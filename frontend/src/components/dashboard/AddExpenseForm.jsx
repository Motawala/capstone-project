import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Autocomplete, Button, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import dayjs from 'dayjs'
import styles from '../../pages/dashboard.module.css'

const categoryOptions = ['Housing', 'Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Travel', 'Utilities', 'Other']
const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Bank Transfer']

function AddExpenseForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: dayjs(),
    description: '',
    category: categoryOptions[0],
    paymentMethod: paymentMethods[0],
    amount: '',
  })

  const textFieldStyles = useMemo(() => ({
    variant: 'outlined',
    color: 'info',
    size: 'small',
    required: true,
    fullWidth: true,
    margin: 'dense',
    InputLabelProps: { sx: { color: '#94a3b8', '&.Mui-focused': { color: '#22d3ee' } } },
    sx: {
      backgroundColor: '#0d1326',
      borderRadius: '10px',
      '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        color: '#e2e8f0',
        backgroundColor: '#0d1326',
        minHeight: '44px',
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
      '& .MuiPickersCalendarHeader-label, & .MuiDayCalendar-weekDayLabel': {
        color: '#cbd5e1',
      },
      '& .MuiPickersYear-button.Mui-selected': {
        backgroundColor: 'rgba(34, 211, 238, 0.24)',
        border: '1px solid #22d3ee',
        color: '#e2e8f0',
      },
      '& .MuiPickersYear-button': {
        color: '#e2e8f0',
      },
      '& .MuiPickersDay-root': {
        color: '#e2e8f0',
      },
      '& .MuiPickersDay-root.Mui-selected': {
        backgroundColor: 'rgba(34, 211, 238, 0.24)',
        border: '1px solid #22d3ee',
      },
    },
  }), [])

  const autoCompleteProps = useMemo(
    () => ({
      fullWidth: true,
      disableClearable: true,
      size: 'small',
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
        '& .MuiInputBase-root': {
          minHeight: '44px',
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

        <div className={styles.formColumn}>
          <DesktopDatePicker
            label="Date"
            value={formData.date}
            onChange={handleDateChange}
            format="MM/DD/YYYY"
            views={['year', 'month', 'day']}
            slotProps={{
              textField: {
                ...textFieldStyles,
                InputLabelProps: { ...textFieldStyles.InputLabelProps, shrink: true },
              },
              openPickerButton: { color: 'info' },
              desktopPaper: {
                sx: {
                  backgroundColor: '#0f1629',
                  border: '1px solid #22d3ee',
                  boxShadow: '0 14px 36px rgba(34, 211, 238, 0.16)',
                  '.MuiPickersCalendarHeader-label': { color: '#e2e8f0', fontWeight: 700 },
                  '.MuiPickersArrowSwitcher-button': { color: '#22d3ee' },
                  '.MuiPickersCalendarHeader-switchViewButton': { color: '#22d3ee' },
                  '.MuiPickersMonth-root, .MuiPickersYear-root': { color: '#e2e8f0' },
                  '.MuiPickersMonth-monthButton': { color: '#e2e8f0' },
                  '.MuiPickersMonth-monthButton.Mui-selected': {
                    backgroundColor: 'rgba(34, 211, 238, 0.24)',
                    border: '1px solid #22d3ee',
                  },
                  '.MuiPickersYear-yearButton': { color: '#e2e8f0' },
                  '.MuiPickersYear-yearButton.Mui-selected': {
                    backgroundColor: 'rgba(34, 211, 238, 0.24)',
                    border: '1px solid #22d3ee',
                  },
                  '.MuiDayCalendar-weekDayLabel': { color: '#cbd5e1' },
                  '.MuiPickersDay-root': { color: '#e2e8f0' },
                  '.MuiPickersDay-root.Mui-selected': {
                    backgroundColor: 'rgba(34, 211, 238, 0.24)',
                    border: '1px solid #22d3ee',
                  },
                  '.MuiPickersYear-button': { color: '#e2e8f0' },
                  '.MuiPickersYear-button.Mui-selected': {
                    backgroundColor: 'rgba(34, 211, 238, 0.24)',
                    border: '1px solid #22d3ee',
                    color: '#e2e8f0',
                  },
                },
              },
            }}
          />

          <TextField
            label="Expense Desc"
            value={formData.description}
            onChange={handleChange('description')}
            {...textFieldStyles}
          />

          <Autocomplete
            {...autoCompleteProps}
            options={categoryOptions}
            value={formData.category || categoryOptions[0]}
            onChange={(_, value) => setFormData((prev) => ({ ...prev, category: value }))}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: '#0f1629',
                  border: '1px solid #1f2b4e',
                  color: '#e2e8f0',
                },
              },
              popupIndicator: { sx: { color: '#22d3ee' } },
              clearIndicator: { sx: { color: '#22d3ee' } },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                {...textFieldStyles}
                inputProps={{ ...params.inputProps, required: true }}
              />
            )}
          />

          <Autocomplete
            {...autoCompleteProps}
            options={paymentMethods}
            value={formData.paymentMethod || paymentMethods[0]}
            onChange={(_, value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: '#0f1629',
                  border: '1px solid #1f2b4e',
                  color: '#e2e8f0',
                },
              },
              popupIndicator: { sx: { color: '#22d3ee' } },
              clearIndicator: { sx: { color: '#22d3ee' } },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Payment Method"
                {...textFieldStyles}
                inputProps={{ ...params.inputProps, required: true }}
              />
            )}
          />

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
          <Button type="submit" variant="contained" color="info" size="small">
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
