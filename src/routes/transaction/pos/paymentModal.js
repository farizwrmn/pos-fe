import React from 'react'
import { Modal } from 'antd'
import Payment from './payment'

const PaymentModal = ({
  ...other
}) => {
  return (
    <div>
      <Modal {...other}>
        <Payment />
      </Modal>
    </div>
  )
}

export default PaymentModal
