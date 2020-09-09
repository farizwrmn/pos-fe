import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import ListInvoice from './ListInvoice'

const Browse = ({ location, pagination, purchase, onChange, loading, onRestoreVoid, onChooseItemItem, onChooseInvoice, onInvoiceHeader, ...purchaseProps }) => {
  const { listInvoice, itemPayment, modalType, isMotion } = purchase
  const modalOpts = {
    ...purchaseProps
  }
  const listProps = {
    dataSource: modalType === 'browseInvoice' ? listInvoice : [],
    loading: loading.effects['purchase/getInvoice'] || loading.effects['purchase/getInvoiceHeader'],
    location,
    item: itemPayment,
    isMotion,
    onInvoiceHeader (period) {
      onInvoiceHeader(period)
    },
    onChooseInvoice (item) {
      onChooseInvoice(item)
    }
  }
  return (
    <Modal {...modalOpts} width={'80%'} height="80%" footer={null}>
      {(modalType === 'browseInvoice') && <ListInvoice {...listProps} />}
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
