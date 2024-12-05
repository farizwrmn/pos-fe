import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import BarcodeLocation from './BarcodeLocation'

const Barcode = ({ stockOpnameBarcode }) => {
  const { list } = stockOpnameBarcode
  return (
    <div className="content-inner"
      style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      {
        list.map((item, idx) => {
          return (
            <div key={idx}>
              <BarcodeLocation locationCode={item.barcode} location={item.locationName} />
            </div>
          )
        })
      }
    </div >
  )
}

Barcode.propTypes = {
  stockOpnameBarcode: PropTypes.object
}

export default connect(({ stockOpnameBarcode }) => ({ stockOpnameBarcode }))(Barcode)
