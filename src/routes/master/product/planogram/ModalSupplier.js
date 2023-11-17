import React from 'react'
import { Modal, Input } from 'antd'

const ModalSupplier = ({ hdlSearch, children, ...props }) => {
  return (
    <div>
      <Modal {...props}>
        <Input
          ref={input => input && input.focus()}
          placeholder="Search Supplier"
          onKeyDown={(e) => {
            const { value } = e.target
            if (e.keyCode === 13) {
              hdlSearch(value)
            }
          }}
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
