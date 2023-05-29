import React from 'react'
import { Row, Modal, Col, Spin } from 'antd'

const ModalBalanceSheetDetail = ({
  listDetailStore,
  loading,
  ...modalProps
}) => {
  return (
    <Modal {...modalProps}>
      {loading ? (
        <Spin />
      ) : (
        <div>
          {listDetailStore && listDetailStore.filter(filtered => filtered.debit !== 0).map(item => (
            <Row>
              <Col span={12}>{item.storeName}</Col>
              <Col style={{ color: item.debit > 0 ? 'red' : 'initial' }} span={12}>{item.debit < 0 ? ((item.debit || 0) * -1).toLocaleString() : `(${(item.debit || 0).toLocaleString()})`}</Col>
            </Row>
          ))}
        </div>
      )}

    </Modal>
  )
}

export default ModalBalanceSheetDetail
