/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import { connect } from 'dva'
import { Payment } from '../components'

const PaymentTab = () => {
  return (
    <div className="content-inner">
      <Payment />
    </div>
  )
}

export default connect(({ accountPayment }) => ({ accountPayment }))(PaymentTab)
