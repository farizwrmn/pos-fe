import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

const TaxInfo = ({
  posData
}) => {
  if (!posData) return null
  if (!posData.companyInfo) return null
  if (!posData.companyInfo.companyName) return null

  return (
    <div className={styles.amountSection}>
      <div span={12} className={styles.invoiceQueue} style={{ fontSize: 13, alignItems: 'center', justifyContent: 'center' }}>
        {posData.companyInfo.companyName}
      </div>
      <div span={12} className={styles.invoiceQueue} style={{ fontSize: 11, alignItems: 'center', justifyContent: 'center' }}>
        <pre>{posData.companyInfo.companyAddress}</pre>
      </div>
      <div span={12} className={styles.invoiceQueue} style={{ fontSize: 11, alignItems: 'center', justifyContent: 'center' }}>
        NPWP: {posData.companyInfo.taxID}
      </div>
      <div span={12} className={styles.invoiceQueue} style={{ fontSize: 11, alignItems: 'center', justifyContent: 'center' }}>
        WA BUSINESS: {posData.companyInfo.contact}
      </div>
      <div>
        BARANG KENA PAJAK SUDAH TERMASUK PPN
      </div>
    </div>
  )
}

TaxInfo.propTypes = {
  posData: PropTypes.object.isRequired
}

export default TaxInfo
