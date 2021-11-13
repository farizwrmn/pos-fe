import React from 'react'
import { Modal } from 'antd'

const ModalQuantity = ({ count, listStoreLov, ...props }) => {
  return (
    <div>
      <Modal {...props}>
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
            Total: {count.reduce((prev, next) => prev + next.count, 0)}
          </div>
        )}
      </Modal>
    </div>
  )
}

ModalQuantity.propTypes = {

}

export default ModalQuantity
