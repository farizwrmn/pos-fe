import React from 'react'
import { Modal, Form } from 'antd'

const ModalEditSupplier = ({ ...modalProps }) => {
  return (
    <Modal
      {...modalProps}
    >
      ModalEditSupplier
    </Modal>
  )
}


export default Form.create()(ModalEditSupplier)
