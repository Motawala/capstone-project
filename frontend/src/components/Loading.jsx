import PropTypes from 'prop-types'
import { CircularProgress, Typography } from '@mui/material'
import styles from './loading.module.css'

function Loading({ message = 'Loading data...', size = 56, fullHeight = false, className = '' }) {
  return (
    <div className={`${styles.shell} ${fullHeight ? styles.fullHeight : ''} ${className}`.trim()}>
      <div className={styles.glow} aria-hidden>
        <CircularProgress size={size} thickness={4.6} color="info" />
      </div>
      <Typography component="div" className={styles.label}>
        {message}
      </Typography>
      <p className={styles.hint}>Please wait a moment</p>
    </div>
  )
}

Loading.propTypes = {
  message: PropTypes.string,
  size: PropTypes.number,
  fullHeight: PropTypes.bool,
  className: PropTypes.string,
}

export default Loading
