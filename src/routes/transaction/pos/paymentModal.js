import React from 'react'
import { Modal } from 'antd'
import Payment from './payment'

const PaymentModal = ({
  selectedPaymentShortcut,
  ...other
}) => {
  return (
    <div>
      <Modal {...other}>
        <Payment selectedPaymentShortcut={selectedPaymentShortcut} />
      </Modal>
    </div>
  )
}

export default PaymentModal
