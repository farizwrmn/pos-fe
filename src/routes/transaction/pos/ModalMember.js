import React from 'react'
import { Modal } from 'antd'
import { FormCustomer } from '../../master/customer/components'

const Member = ({
  modalAddMember,
  cancelMember
}) => {
  const modalProps = {
    visible: modalAddMember,
    title: 'Add Member',
    footer: null,
    width: 1000,
    onCancel () {
      cancelMember()
    }
  }

  const formCustomerProps = {
    item: {},
    modalType: 'addMember',
    cancelMember
  }

  return (
    <Modal {...modalProps}>
      <FormCustomer {...formCustomerProps} />
    </Modal>
  )
}

export default Member
