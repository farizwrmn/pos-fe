import React from 'react'
import { Modal } from 'antd'
import { FormUnit } from '../../master/customer/components'

const Asset = ({
  confirmSendUnit,
  cancelUnit,
  modalAddUnit
}) => {
  const modalProps = {
    visible: modalAddUnit,
    title: 'Add Unit',
    footer: null,
    onCancel () {
      cancelUnit()
    }
  }


  const formUnitProps = {
    item: {},
    modalType: 'addUnit',
    confirmSendUnit,
    cancelUnit
  }

  return (
    <Modal {...modalProps}>
      <FormUnit {...formUnitProps} />
    </Modal>
  )
}

export default Asset
