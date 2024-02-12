import React from 'react'
import { Modal } from 'antd'
import { FormCustomer } from '../../master/customer/components'

const Member = ({
  item,
  loading,
  modalAddMember,
  cancelMember
}) => {
  const modalProps = {
    visible: modalAddMember,
    title: 'Add Member',
    footer: null,
    onCancel () {
      cancelMember()
    }
  }

  const formCustomerProps = {
    item,
    loading,
    modalType: 'addMember',
    cancelMember
  }

  return (
    <Modal className="modal-browse" {...modalProps}>
      <FormCustomer {...formCustomerProps} />
    </Modal>
  )
}

export default Member
