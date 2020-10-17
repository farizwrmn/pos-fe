import React from 'react'
import { connect } from 'dva'

// import Fifo from './Fifo'
import Purchase from './Purchase'
import AdjustIn from './AdjustIn'
import ReturnSales from './ReturnSales'
import TransferIn from './TransferIn'
import POS from './POS'
import AdjustOut from './AdjustOut'
import TransferOut from './TransferOut'
import ReturnPurchase from './ReturnPurchase'
// import SalesPayment from './SalesPayment'
// import PurchasePayment from './PurchasePayment'

const HealthCheckup = ({ healthcheckup }) => {
  const {
    listUnitAll
  } = healthcheckup

  const checkupProps = {
    listUnitAll
  }

  return (
    <div>
      <div>Health Checkup</div>
      {/* <Fifo /> */}
      <Purchase {...checkupProps} />
      <AdjustIn {...checkupProps} />
      <ReturnSales {...checkupProps} />
      <TransferIn {...checkupProps} />
      <POS {...checkupProps} />
      <AdjustOut {...checkupProps} />
      <TransferOut {...checkupProps} />
      <ReturnPurchase {...checkupProps} />
      {/* <SalesPayment {...checkupProps} /> */}
      {/* <PurchasePayment {...checkupProps} /> */}
    </div>
  )
}

export default connect(({ healthcheckup }) => ({ healthcheckup }))(HealthCheckup)
