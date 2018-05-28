import React from 'react'
import { Modal } from 'antd'
import { FormUnit } from '../components'

const ModalUnit = ({
  addUnit,
  confirmSendUnit,
  cancelUnit
}) => {
  const modalProps = {
    visible: addUnit.modal,
    title: 'Add Unit',
    footer: null,
    onCancel () {
      cancelUnit()
    }
  }

  const formProps = {
    item: {},
    modalType: 'addUnit',
    confirmSendUnit,
    cancelUnit
  }
  return (
    <Modal {...modalProps}>
      <FormUnit {...formProps} />
    </Modal>
  )
}

export default ModalUnit
