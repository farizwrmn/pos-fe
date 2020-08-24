/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import { connect } from 'dva'
import { Payment } from '../components'

const PaymentTab = ({ location }) => {
  return (
    <div className="content-inner">
      <Payment location={location} />
    </div>
  )
}

export default connect(({ accountPayment }) => ({ accountPayment }))(PaymentTab)
