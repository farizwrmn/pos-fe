import React from 'react'
import { Modal, Card } from 'antd'
import BalanceUser from './BalanceUser'
import BalanceSummary from './BalanceSummary'
import BalanceDetail from './BalanceDetail'

const ModalApprove = ({ ...modalProps }) => {
  return (
    <div>
      <Modal {...modalProps}>
        <Card title="User Info">
          <BalanceUser {...modalProps} />
        </Card>
        <Card
          title={(
            <div>
              <div>{'Problem Summary (negative => Overinput)'}</div>
            </div>
          )}
        >
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
