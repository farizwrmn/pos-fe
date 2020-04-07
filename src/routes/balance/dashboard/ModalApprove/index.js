import React from 'react'
import { Modal, Card } from 'antd'
import BalanceSummary from './BalanceSummary'
import BalanceDetail from './BalanceDetail'

const ModalApprove = ({ ...modalProps }) => {
  return (
    <div>
      <Modal {...modalProps}>
        <Card title="Summary">
          <BalanceSummary {...modalProps} />
        </Card>
        <Card title="Detail">
          <BalanceDetail {...modalProps} />
        </Card>
      </Modal>
    </div>
  )
}

export default ModalApprove
