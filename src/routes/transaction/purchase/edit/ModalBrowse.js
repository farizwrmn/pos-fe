import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListProduct from './ListProduct'
import ListInvoice from './ListInvoice'

const Browse = ({ location, purchase, loading, onChooseItemItem, onChooseInvoice, ...purchaseProps }) => {
  const { listProduct, listInvoice, itemPayment, modalType, isMotion } = purchase
  const modalOpts = {
    ...purchaseProps,
  }
  const listProps = {
    dataSource: (
      modalType === 'browseProduct' ? listProduct : listInvoice
    ),
    loading: loading.effects[(
      modalType === 'browseProduct' ? 'purchase/getProducts' : 'purchase/getInvoice'
    )],
    location,
    item: itemPayment,
    isMotion,
    onChooseItem (item) {
      onChooseItemItem(item)
    },
    onChooseInvoice (item) {
      onChooseInvoice(item)
    },
  }
  return (
    <Modal {...modalOpts} width={'80%'} height="80%" footer={[]}>
      { (modalType === 'browseProduct') && <ListProduct {...listProps} /> }
      { (modalType === 'browseInvoice') && <ListInvoice {...listProps} /> }
    </Modal>
  )
}

Browse.propTypes = {
  purchase: PropTypes.isRequired,
  location: PropTypes.isRequired,
  loading: PropTypes.isRequired,
  onChooseItemItem: PropTypes.func.isRequired,
  onChooseInvoice: PropTypes.func.isRequired,
}

export default Browse
