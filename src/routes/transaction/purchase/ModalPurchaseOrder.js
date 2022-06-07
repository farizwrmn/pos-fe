import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListInvoice from './ListInvoice'

const ModalPurchaseOrder = ({ listPurchaseOrder, location, purchase, dispatch, loading, onChooseInvoice, onInvoiceHeader, ...modalProps }) => {
  const { itemPayment } = purchase
  const listProps = {
    dataSource: listPurchaseOrder,
    listPurchaseOrder,
    loading: loading.effects['purchase/getPurchaseOrder'],
    location,
    item: itemPayment,
    onInvoiceHeader (period) {
      onInvoiceHeader(period)
    },
    onChooseInvoice (item) {
      onChooseInvoice(item)
    }
  }
  return (
    <Modal {...modalProps} width="80%" height="80%" footer={null}>
      <ListInvoice {...listProps} />
    </Modal>
  )
}

ModalPurchaseOrder.propTypes = {
  purchase: PropTypes.isRequired,
  location: PropTypes.isRequired,
  loading: PropTypes.isRequired,
  onChooseItemItem: PropTypes.func.isRequired,
  onRestoreVoid: PropTypes.func.isRequired,
  onChooseInvoice: PropTypes.func.isRequired,
  onInvoiceHeader: PropTypes.func
}

export default ModalPurchaseOrder
