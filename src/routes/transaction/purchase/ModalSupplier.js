import React from 'react'
import { Modal, Input } from 'antd'

const { Search } = Input

const ModalSupplier = ({ hdlSearch, children, ...props }) => {
  return (
    <div>
      <Modal {...props}>
        <Search placeholder="Search Supplier"
          size="small"
          onEnter={e => hdlSearch(e)}
          onSearch={e => hdlSearch(e)}
          style={{ marginBottom: 16 }}
        />
        {children}
      </Modal>
    </div>
  )
}

ModalSupplier.propTypes = {

}

export default ModalSupplier
