import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'antd'
import ListMember from '../transaction/pos/ListMember'
import ListMechanic from '../transaction/pos/ListMechanic'
import ListUnit from '../transaction/pos/ListUnit'

const ModalBrowse = ({
  onOk,
  modalType,
  listMember,
  listMechanic,
  listUnit,
  setItemForForm,
  onHideModal,
  ...modalProps
}) => {
  const getDataSource = () => {
    switch (modalType) {
      case 'unit': return listUnit
        break
      case 'member': return listMember
        break
      case 'mechanic': return listMechanic
        break
      default: return
    }
  }
  const getItem = (e) => {
    switch (modalType) {
      case 'unit': return { policeNo: e.policeNo, policeNoId: e.id }
        break
      case 'member': return { memberId: e.id, memberCode: e.memberCode, memberName: e.memberName, policeNo: null, policeNoId: null, lastMeter: null }
        break
      case 'mechanic': return { technicianId: e.employeeId, technicianName: e.employeeName }
        break
      default: return
    }
  }
  const modalOpts = {
    dataSource: getDataSource(),
    ...modalProps,
    onChooseItem(e) {
      const item = getItem(e)
      setItemForForm(item)
      onHideModal()
    }
  }

  const getComponent = () => {
    switch (modalType) {
      case 'unit': return <ListUnit {...modalOpts} />
        break
      case 'member': return <ListMember {...modalOpts} />
        break
      case 'mechanic': return <ListMechanic {...modalOpts} />
        break
      default: return
    }
  }
  return (
    <Modal {...modalOpts} footer={[
      <Button key="back" onClick={() => onCancel()}>Cancel</Button>,
    ]}>
      {getComponent()}
    </Modal>
  )
}

ModalBrowse.propTypes = {
  onOk: PropTypes.func,
  setItem: PropTypes.func
}

export default ModalBrowse
