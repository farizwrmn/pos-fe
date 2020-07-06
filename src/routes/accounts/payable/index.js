/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import { connect } from 'dva'
import { Payable } from '../components'


const PaymentTab = () => {
  return (
    <div className="content-inner">
      <Payable />
    </div>
  )
}

export default connect(({ accountPayment }) => ({ accountPayment }))(PaymentTab)
