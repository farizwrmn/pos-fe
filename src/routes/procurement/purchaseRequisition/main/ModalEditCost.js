import React from 'react'
import { Modal, Form } from 'antd'

const ModalEditCost = ({ ...modalProps }) => {
  return (
    <Modal
      {...modalProps}
    >
      ModalEditCost
    </Modal>
  )
}


export default Form.create()(ModalEditCost)
