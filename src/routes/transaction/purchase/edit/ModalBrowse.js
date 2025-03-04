import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProduct'
import ListInvoice from './ListInvoice'
import ListVoid from './ListVoid'

const Browse = ({ location, pagination, purchase, onChange, loading, onRestoreVoid, onChooseItemItem, onChooseInvoice, onInvoiceHeader, ...purchaseProps }) => {
  const { listProduct, listInvoice, listVoid, itemPayment, modalType, isMotion } = purchase
  const modalOpts = {
    ...purchaseProps
  }
  let listProductFilter = listProduct ? listProduct.filter(el => el.active) : []
  const listProps = {
    dataSource: modalType === 'browseProduct' ? listProductFilter : modalType === 'browseInvoice' ? listInvoice : listVoid,
    loading: loading.effects[(
      modalType === 'browseProduct' ? 'purchase/getProducts' : modalType === 'browseInvoice' ? 'purchase/getInvoice' : 'purchase/getVoid'
    )] || loading.effects['purchase/getInvoiceHeader'],
    location,
    item: itemPayment,
    isMotion,
    onInvoiceHeader (period) {
      onInvoiceHeader(period)
    },
    onChooseItem (item) {
      onChooseItemItem(item)
    },
    onRestoreVoid (item) {
      onRestoreVoid(item)
    },
    onChooseInvoice (item) {
      onChooseInvoice(item)
    }
  }
  const productProps = {
    pagination,
    onChange (e) {
      onChange(e)
    },
    ...listProps
  }
  return (
    <Modal {...modalOpts} width={'80%'} height="80%" footer={null}>
      {(modalType === 'browseProduct') && <ListProduct {...productProps} />}
      {(modalType === 'browseInvoice') && <ListInvoice {...listProps} />}
      {(modalType === 'browseVoid') && <ListVoid {...listProps} />}
    </Modal>
  )
}

Browse.propTypes = {
  purchase: PropTypes.isRequired,
  location: PropTypes.isRequired,
  loading: PropTypes.isRequired,
  onChooseItemItem: PropTypes.func.isRequired,
  onRestoreVoid: PropTypes.func.isRequired,
  onChooseInvoice: PropTypes.func.isRequired,
  onInvoiceHeader: PropTypes.func
}

export default Browse
