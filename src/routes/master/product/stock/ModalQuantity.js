import React from 'react'
import { Modal, Row, Col } from 'antd'

const ModalQuantity = ({ count, listPrice, listStoreLov, ...props }) => {
  return (
    <div>
      <Modal {...props}>
        <Row>
          <Col span={12}>
            {count && count.map((item) => {
              const store = listStoreLov.filter(filtered => filtered.id === item.storeId)
              if (store && store[0]) {
                const storeItem = store[0]
                return (
                  <div>
                    {`${storeItem.storeName}: ${item.count}`}
                  </div>
                )
              }
              return null
            })}
            {count && count.length > 0 && (
              <div>
                <strong>TOTAL: {count.reduce((prev, next) => prev + next.count, 0)}</strong>
              </div>
            )}
          </Col>
          <Col span={12}>
            {listPrice && listPrice.map((item) => {
              const store = listStoreLov.filter(filtered => filtered.id === item.storeId)
              if (store && store[0]) {
                const storeItem = store[0]
                return (
                  <div>
                    {`${storeItem.storeName}: ${(item.sellPrice).toLocaleString()}`}
                  </div>
                )
              }
              return null
            })}
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

ModalQuantity.propTypes = {

}

export default ModalQuantity
