import React from 'react'
import { connect } from 'dva'

const PayableForm = () => {
  return (
    <div className="content-inner">
      Payable Form
    </div>
  )
}

export default connect(({ accountPayment }) => ({ accountPayment }))(PayableForm)
