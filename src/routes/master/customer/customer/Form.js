import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Icon } from 'antd'
import ModalUnit from './ModalUnit'
import { AdvancedFormMember } from '../components'

const formCustomer = ({
  modalType,
  item,
  modalAddUnit,
  addUnit,
  confirmAddUnit,
  confirmSendUnit,
  cancelUnit
}) => {
  const formCustomerProps = {
    item,
    modalType
  }

  const modalUnitProps = {
    addUnit,
    confirmSendUnit,
    cancelUnit
  }

  const modalProps = {
    visible: modalAddUnit,
    title: <span><Icon type="question-circle-o" /> Confirm</span>,
    onOk () {
      confirmAddUnit()
    },
    onCancel () {
      cancelUnit()
    }
  }

  return (
    <div>
      {modalAddUnit && <Modal {...modalProps}>Do you want to add asset for {addUnit.info.name}? </Modal>}
      {addUnit.modal && <ModalUnit {...modalUnitProps} />}
      <AdvancedFormMember {...formCustomerProps} />
    </div>
  )
}

formCustomer.propTypes = {
  item: PropTypes.object.isRequired,
  clickBrowse: PropTypes.func.isRequired,
  activeKey: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired
}

export default formCustomer
