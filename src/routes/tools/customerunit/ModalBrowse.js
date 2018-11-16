import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { DataQuery } from 'components'
import ListProductLock from '../../transaction/pos/ListProductLock'

const { TransferOut } = DataQuery

const ModalBrowse = ({
  onOk,
  modalType,
  listProduct,
  listTrans,
  setItemForForm,
  onHideModal,
  loading,
  getTransferOut,
  ...modalProps
}) => {
  const getDataSource = () => {
    switch (modalType) {
      case 'product': return listProduct
      case 'transfer': return listTrans
      default:
    }
  }
  const getItem = (e) => {
    switch (modalType) {
      case 'product': return { productId: e.id, productName: e.productName }
      case 'transfer': return { transferOutId: e.transNoId, transNo: e.transNo }
      default:
    }
  }
  const modalOpts = {
    dataSource: getDataSource(),
    loading,
    isModal: false,
    footer: null,
    ...modalProps,
    onChooseItem (e) {
      const item = getItem(e)
      setItemForForm(item)
      onHideModal()
    },
    onRowClick (e) {
      const item = getItem(e)
      setItemForForm(item)
      onHideModal()
      if (modalType === 'transfer') {
        getTransferOut(e.transNoId)
      }
    }
  }

  const getComponent = () => {
    switch (modalType) {
      case 'product': return <ListProductLock {...modalOpts} />
      case 'transfer': return <TransferOut {...modalOpts} />
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
