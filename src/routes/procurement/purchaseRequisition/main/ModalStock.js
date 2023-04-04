import React from 'react'
import { Modal, Form } from 'antd'

const ModalStock = ({ ...modalProps }) => {
  return (
    <Modal
      {...modalProps}
    >
      ModalStock
    </Modal>
  )
}


export default Form.create()(ModalStock)
