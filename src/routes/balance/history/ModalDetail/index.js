import React from 'react'
import { Modal, Card } from 'antd'
import { lstorage } from 'utils'
import moment from 'moment'
import BalanceUser from './BalanceUser'
import BalanceSummary from './BalanceSummary'
import BalanceDetail from './BalanceDetail'

const ModalApprove = ({ ...modalProps }) => {
  let defaultRole = (lstorage.getStorageKey('udi')[2] || '')
  const { item } = modalProps
  return (
    <div>
      <Modal {...modalProps}>
        <Card title="User Info">
          <BalanceUser {...modalProps} />
        </Card>
        {item && item.closed && moment(moment(item.closed).format('YYYY-MM-DD'), 'YYYY-MM-DD').isBefore(moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')) ? (defaultRole === 'HKS' || defaultRole === 'ADF' || defaultRole === 'SFC' || defaultRole === 'HFC') ? (
          <div>
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
          </div>
        ) : 'Invalid Role to see the detail' : 'Closing and Wait until tommorrow to see the detail'}
      </Modal>
    </div>
  )
}

export default ModalApprove
