import React from 'react'
import { Modal, Form } from 'antd'

const ModalEditQty = ({ ...modalProps }) => {
  return (
    <Modal
      {...modalProps}
    >
      ModalEditQty
    </Modal>
  )
}


export default Form.create()(ModalEditQty)
