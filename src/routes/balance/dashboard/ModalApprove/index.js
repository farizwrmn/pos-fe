import React from 'react'
import { Modal, Card } from 'antd'
import BalanceSummary from './BalanceSummary'
import BalanceDetail from './BalanceDetail'

const ModalApprove = ({ ...modalProps }) => {
  return (
    <div>
      <Modal {...modalProps}>
        <Card title="Summary (Just only problem transaction)">
          <BalanceSummary {...modalProps} />
        </Card>
        <Card title="Detail (Closing - By input)">
          <BalanceDetail {...modalProps} />
        </Card>
      </Modal>
    </div>
  )
}

export default ModalApprove
