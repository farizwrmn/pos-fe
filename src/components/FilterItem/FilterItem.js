import React from 'react'
import PropTypes from 'prop-types'
import styles from './FilterItem.less'

const FilterItem = ({
  label = '',
  children
}) => {
  return (
    <div className={styles.filterItem}>
      <div className={styles.labelWrap}>
        <span className="labelText" >{label}</span>
      </div>
      <div className={styles.item}>
        {children}
      </div>
    </div>
  )
}

FilterItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.element
}

export default FilterItem
