import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListMember from '../../transaction/pos/ListMember'
import ListMechanic from '../../transaction/pos/ListMechanic'
import ListUnit from '../../transaction/pos/ListUnit'

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
      case 'member': return listMember
      case 'mechanic': return listMechanic
      default:
    }
  }
  const getItem = (e) => {
    switch (modalType) {
      case 'unit': return { policeNo: e.policeNo, policeNoId: e.id }
      case 'member': return { memberId: e.id, memberCode: e.memberCode, memberName: e.memberName, policeNo: null, policeNoId: null, lastMeter: null }
      case 'mechanic': return { technicianId: e.employeeId, technicianName: e.employeeName }
      default:
    }
  }
  const modalOpts = {
    dataSource: getDataSource(),
    ...modalProps,
    onChooseItem (e) {
      const item = getItem(e)
      setItemForForm(item)
      onHideModal()
    }
  }

  const getComponent = () => {
    switch (modalType) {
      case 'unit': return <ListUnit {...modalOpts} />
      case 'member': return <ListMember {...modalOpts} />
      case 'mechanic': return <ListMechanic {...modalOpts} />
      default:
    }
  }
  return (
    <Modal {...modalOpts}>
      {getComponent()}
    </Modal>
  )
}

ModalBrowse.propTypes = {
  onOk: PropTypes.func,
  setItem: PropTypes.func
}

export default ModalBrowse
