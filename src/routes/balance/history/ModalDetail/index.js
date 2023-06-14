import React from 'react'
import { Modal, Card } from 'antd'
import BalanceUser from './BalanceUser'
import BalanceSummary from './BalanceSummary'
import BalanceDetail from './BalanceDetail'

const ModalApprove = (modalProps) => {
  const { item } = modalProps
  return (
    <div>
      <Modal {...modalProps}>
        <Card title="User Info">
          <BalanceUser {...modalProps} />
        </Card>
        {item && item.closed ? (
          <Card
            title={(
              <div>
                <div>{'Problem Summary (negative => Overinput)'}</div>
              </div>
            )}
          >
            <BalanceSummary {...modalProps} />
          </Card>
        ) : null}
        {item && item.closed ? (
          <Card title="Detail (Closing - By input)">
            <BalanceDetail {...modalProps} />
          </Card>
        ) : null}
      </Modal>
    </div>
  )
}

export default ModalApprove
